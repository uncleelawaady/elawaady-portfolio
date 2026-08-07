/* ===========================================================================
   الصور: تمويه البيانات الحساسة، ضغط، ورفع
   ===========================================================================
   الترتيب مقصود: **التمويه بيتعمل على البكسلات نفسها قبل أي حاجة تانية**،
   وبعدين الصورة الناتجة هي اللي بتتضغط وتترفع. يعني اللي اتمسح متشال من
   الملف، مش متغطى بطبقة فوقه ممكن حد يشيلها.

   الأصل اللي المستخدم اختاره مبيخرجش من جهازه أبدًا.
=========================================================================== */

import { storage, ref, uploadBytes, getDownloadURL } from './firebase.js';

export const LIMITS = {
  maxFiles:     4,
  maxBytes:     5 * 1024 * 1024,
  maxDimension: 1600,
  thumbSize:    400,
  quality:      0.82,
  types:        ['image/jpeg', 'image/png', 'image/webp']
};

/* ---------------------------------------------------------------------------
   قراءة الملف
--------------------------------------------------------------------------- */
export function checkFile(file) {
  if (!LIMITS.types.includes(file.type)) return 'الصور بس: JPG أو PNG أو WEBP.';
  if (file.size > LIMITS.maxBytes)       return `«${file.name}» أكبر من 5 ميجا.`;
  return null;
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error('مقدرتش أقرا الصورة دي.'));
    img.src = src;
  });
}

export const fileToURL = (file) => URL.createObjectURL(file);

/* ---------------------------------------------------------------------------
   لوحة التمويه
   ---------------------------------------------------------------------------
   المستخدم بيمسح بصباعه فوق الأرقام والأسماء، والمسح بيتطبق على الكانفس
   على طول. مفيش «تراجع» بعد الحفظ — وده مقصود: الحاجة اللي اتمسحت راحت.
--------------------------------------------------------------------------- */
export class Redactor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d', { willReadFrequently: true });
    this.brush  = 34;
    this.drawing = false;
    this.dirty   = false;
    this.history = [];     // للتراجع أثناء الشغل قبل الحفظ

    this._down = this._down.bind(this);
    this._move = this._move.bind(this);
    this._up   = this._up.bind(this);
  }

  async load(src) {
    const img = await loadImage(src);

    /* بنصغّر هنا مرة واحدة: اللي بيتمسح بيتمسح على المقاس النهائي، فمفيش
       تفاصيل بترجع تاني لما نصغّر بعدين. */
    const scale = Math.min(1, LIMITS.maxDimension / Math.max(img.width, img.height));
    this.canvas.width  = Math.round(img.width * scale);
    this.canvas.height = Math.round(img.height * scale);
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);

    this.dirty = false;
    this.history = [];
    this._bind();
    return this;
  }

  _bind() {
    const c = this.canvas;
    c.style.touchAction = 'none';
    c.addEventListener('pointerdown', this._down);
    c.addEventListener('pointermove', this._move);
    window.addEventListener('pointerup', this._up);
  }

  destroy() {
    const c = this.canvas;
    c.removeEventListener('pointerdown', this._down);
    c.removeEventListener('pointermove', this._move);
    window.removeEventListener('pointerup', this._up);
  }

  _at(e) {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (this.canvas.width  / r.width),
      y: (e.clientY - r.top)  * (this.canvas.height / r.height)
    };
  }

  _down(e) {
    e.preventDefault();
    /* لقطة قبل كل ضربة، عشان «تراجع» يرجّع خطوة كاملة مش نقطة */
    this.history.push(this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    if (this.history.length > 12) this.history.shift();
    this.drawing = true;
    this._paint(this._at(e));
  }

  _move(e) { if (this.drawing) this._paint(this._at(e)); }
  _up()    { this.drawing = false; }

  /* بكسلة حقيقية: بناخد المربع، نصغّره لحتة صغيرة، ونرجّعه مكبّر —
     فالمعلومة اللي كانت فيه بتضيع فعلًا. */
  _paint({ x, y }) {
    const size = this.brush;
    const half = size / 2;
    const sx = Math.max(0, Math.round(x - half));
    const sy = Math.max(0, Math.round(y - half));
    const sw = Math.min(size, this.canvas.width  - sx);
    const sh = Math.min(size, this.canvas.height - sy);
    if (sw <= 0 || sh <= 0) return;

    const tiny = document.createElement('canvas');
    tiny.width = Math.max(1, Math.round(sw / 9));
    tiny.height = Math.max(1, Math.round(sh / 9));
    const tctx = tiny.getContext('2d');
    tctx.drawImage(this.canvas, sx, sy, sw, sh, 0, 0, tiny.width, tiny.height);

    this.ctx.imageSmoothingEnabled = false;
    this.ctx.drawImage(tiny, 0, 0, tiny.width, tiny.height, sx, sy, sw, sh);
    this.ctx.imageSmoothingEnabled = true;
    this.dirty = true;
  }

  undo() {
    const last = this.history.pop();
    if (!last) return false;
    this.ctx.putImageData(last, 0, 0);
    this.dirty = this.history.length > 0;
    return true;
  }

  /* الناتج JPEG دايمًا: أصغر، ومفيش شفافية تحمل معلومة مخفية،
     وبيتخلص من أي بيانات EXIF كانت في الأصل (مكان التصوير مثلًا). */
  toBlob(quality = LIMITS.quality) {
    return new Promise(res => this.canvas.toBlob(res, 'image/jpeg', quality));
  }
}

/* ---------------------------------------------------------------------------
   الضغط والمصغّرة
--------------------------------------------------------------------------- */
async function drawScaled(source, maxDim, quality) {
  const img = source instanceof HTMLImageElement ? source : await loadImage(source);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width  = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise(res => canvas.toBlob(res, 'image/jpeg', quality));
}

export const compress = (src) => drawScaled(src, LIMITS.maxDimension, LIMITS.quality);
export const thumbnail = (src) => drawScaled(src, LIMITS.thumbSize, 0.72);

/* ---------------------------------------------------------------------------
   الرفع
   المسار reviews/{uid}/{reviewId}/… لازم يطابق قواعد الـStorage بالظبط،
   وإلا الرفع هيترفض.
--------------------------------------------------------------------------- */
const randomName = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export async function uploadReviewImage(uid, reviewId, blob, { thumb = null } = {}) {
  const base = `reviews/${uid}/${reviewId}/${randomName()}`;

  const fullRef = ref(storage, `${base}.jpg`);
  await uploadBytes(fullRef, blob, { contentType: 'image/jpeg' });
  const url = await getDownloadURL(fullRef);

  let thumbUrl = url, thumbPath = `${base}.jpg`;
  if (thumb) {
    const tRef = ref(storage, `${base}-thumb.jpg`);
    await uploadBytes(tRef, thumb, { contentType: 'image/jpeg' });
    thumbUrl  = await getDownloadURL(tRef);
    thumbPath = `${base}-thumb.jpg`;
  }

  return { url, path: `${base}.jpg`, thumbUrl, thumbPath, bytes: blob.size };
}
