"use client";

import React, { useEffect, useMemo, useState } from "react";
import NextImage from "next/image";

import main from "../../../public/image/reviews/img_main.png";
import img1 from "../../../public/image/reviews/img_1.png";
import img2 from "../../../public/image/reviews/img_2.png";
import img3 from "../../../public/image/reviews/img_3.png";
import img4 from "../../../public/image/reviews/img_4.png";

const PAGE_SIZE = 5;
const STATIC_COUNT = 5;
const SUPPORTED_MIME = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const DB_NAME = "reviewsDB";
const STORE = "reviews";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGetAll() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function idbAdd(review) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(review);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbDelete(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}


const getSessionId = () => {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem("review_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("review_session_id", id);
  }
  return id;
};


async function compressImageToDataURL(file, maxW = 500, maxH = 500, quality = 0.55) {
  const img = await new Promise((resolve, reject) => {
    const i = new window.Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = URL.createObjectURL(file);
  });

  let { width, height } = img;
  const ratio = Math.min(maxW / width, maxH / height, 1);
  const w = Math.round(width * ratio);
  const h = Math.round(height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  URL.revokeObjectURL(img.src);

  return canvas.toDataURL("image/jpeg", quality);
}

export default function Reviews() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [fileError, setFileError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [sessionId, setSessionId] = useState(null);

  // для "читати більше"
  const [expanded, setExpanded] = useState(new Set());
  const toggleExpand = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });


  useEffect(() => {
    setSessionId(getSessionId());
    (async () => {
      try {
        const all = await idbGetAll();
        all.sort((a, b) => b.createdAt - a.createdAt);
        setReviews(all);
      } catch (e) {
        console.warn("IDB load error:", e);
      }
    })();
  }, []);

  
  useEffect(() => {
    if (!imgFile) {
      setImgPreview("");
      return;
    }
    const r = new FileReader();
    r.onload = (e) => setImgPreview(String(e.target?.result || ""));
    r.readAsDataURL(imgFile);
  }, [imgFile]);

  
  const sorted = useMemo(
    () => reviews.slice().sort((a, b) => b.createdAt - a.createdAt),
    [reviews]
  );
  const totalPages = Math.max(1, Math.ceil((STATIC_COUNT + sorted.length) / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const visibleDynamic = useMemo(() => {
    const globalStart = (page - 1) * PAGE_SIZE;
    const globalEnd = globalStart + PAGE_SIZE;
    const dynStart = Math.max(0, globalStart - STATIC_COUNT);
    const dynEnd = Math.max(0, globalEnd - STATIC_COUNT);
    return sorted.slice(dynStart, dynEnd);
  }, [sorted, page]);

  function resetForm() {
    setText("");
    setImgFile(null);
    setImgPreview("");
    setFileError("");
  }

  async function submitReview(e) {
    e?.preventDefault?.();

    let imgData = "";
    if (imgFile) {
      if (!SUPPORTED_MIME.includes(imgFile.type)) {
        setFileError("Непідтримуваний формат (наприклад, HEIC). Оберіть JPG/PNG/WebP.");
        return;
      }
      try {
        imgData = await compressImageToDataURL(imgFile);
      } catch {
        setFileError("Не вдалося обробити зображення. Спробуйте інший файл.");
        return;
      }
    }

    if (!text.trim() && !imgData) return;

    const review = {
      id: crypto.randomUUID(),
      text: text.trim(),
      imgDataUrl: imgData,
      createdAt: Date.now(),
      sessionId,
    };

    try {
      await idbAdd(review);
      setReviews((prev) => [review, ...prev]);
      setPage(2);
      resetForm();
      setOpen(false);
    } catch (e) {
      console.warn("IDB add error:", e);
    }
  }

  async function deleteReview(id) {
    try {
      await idbDelete(id);
    } catch (e) {
      console.warn("IDB delete error:", e);
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setExpanded((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  }

  function onFileChange(e) {
    const f = e.target.files?.[0] || null;
    setFileError("");
    if (f && !SUPPORTED_MIME.includes(f.type)) {
      setFileError("Непідтримуваний формат (наприклад, HEIC). Оберіть JPG/PNG/WebP.");
      setImgFile(null);
      setImgPreview("");
      return;
    }
    setImgFile(f);
  }

  return (
    <div className="container">
      <h2 className="mb-[67px] mt-8 font-bold text-6xl text-center">Відгуки</h2>

      <div className="flex gap-[140px]">
        <NextImage src={main} alt="Decorative picture with dog" width={413} height={478} />
        <p className="font-medium text-2xl pr-30">
          «Я давно мріяв про собаку, і коли дізнався про цей притулок, вирішив
          спробувати знайти тут свого друга та познайомився з дівчинкою на ім’я
          Луна — вона одразу підбігла й подивилася такими довірливими очима, що
          я зрозумів: це моя собака. Волонтери дуже допомогли, розповіли про її
          характер та особливості догляду. Уже кілька місяців Луна живе зі мною
          вдома — вона стала найвірнішим другом і наповнила життя теплом та
          радістю. Я безмежно вдячний притулку за їхню працю та за те, що
          подарували мені справжнього члена сім’ї.»
        </p>
      </div>

      {page === 1 && (
        <div className="mt-[180px] grid grid-cols-1 md:grid-cols-2 gap-[100px]">
          <div className="w-full flex items-end gap-8">
            <NextImage src={img1} width={288} height={370} alt="Decorative picture with dog" />
            <p className="font-medium text-lg">
              «Ми взяли Барні кілька місяців тому, і він чудово вписався в нашу сім’ю. Це
              найрадісніший і найвідданіший пес, якого можна уявити.»
            </p>
          </div>
          <div className="w-full flex items-end gap-8">
            <NextImage width={288} height={370} src={img2} alt="Decorative picture with dog" />
            <p className="font-medium text-lg">
              «Притулок допоміг нам знайти справжнього друга — собаку на ім’я Белла. Вона
              ніжна й лагідна, і тепер ми не уявляємо життя без неї.»
            </p>
          </div>
          <div className="w-full flex items-end gap-8">
            <NextImage width={288} height={370} src={img3} alt="Decorative picture with dog" />
            <p className="font-medium text-lg">
              «Я прихистила молодого пса Чарлі, і він одразу став моїм напарником у пробіжках.
              Дуже вдячна волонтерам за підтримку та поради.»
            </p>
          </div>
          <div className="w-full flex items-end gap-8">
            <NextImage width={288} height={370} src={img4} alt="Decorative picture with dog" />
            <p className="font-medium text-lg">
              «Забрали до себе собачку Мілу, і вона швидко подружилася з дітьми. Тепер у нашому
              домі ще більше радості й сміху.»
            </p>
          </div>
        </div>
      )}

  
      {page > 1 && (
        <div className="mt-[180px] grid grid-cols-1 md:grid-cols-2 gap-[100px]">
          {visibleDynamic.map((r) => {
            const isOpen = expanded.has(r.id);
            const isLong = (r.text || "").length > 220;

            return (
              <div key={r.id} className="w-full flex items-end gap-8 relative">
                {r.sessionId === sessionId && (
                  <button
                    onClick={() => deleteReview(r.id)}
                    aria-label="Видалити"
                    title="Видалити"
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow border text-gray-700"
                  >
                    ×
                  </button>
                )}

                {r.imgDataUrl && (
                  <img
                    src={r.imgDataUrl}
                    width={288}
                    height={370}
                    alt="Decorative picture with pet"
                    className="rounded-md object-cover"
                    loading="lazy"
                  />
                )}

                <div className="max-w-[400px]">
                  <p
                    className={
                      "font-medium text-lg whitespace-normal " +
                      (isOpen ? "" : "overflow-hidden text-ellipsis line-clamp-6")
                    }
                    style={
                      isOpen
                        ? {}
                        : {
                            display: "-webkit-box",
                            WebkitLineClamp: 6,
                            WebkitBoxOrient: "vertical",
                          }
                    }
                  >
                    {r.text || " "}
                  </p>

                  {isLong && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(r.id)}
                      className="mt-2 text-sm underline opacity-80 hover:opacity-100"
                    >
                      {isOpen ? "Згорнути" : "Читати більше"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {visibleDynamic.length === 0 && (
            <p className="text-center text-lg opacity-70 col-span-full">
              Поки що немає відгуків на цій сторінці.
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-2 rounded-lg border disabled:opacity-40"
        >
          ‹
        </button>
        <span>
          Сторінка <b>{page}</b> з <b>{totalPages}</b>
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-2 rounded-lg border disabled:opacity-40"
        >
          ›
        </button>
      </div>

  
      <button
        onClick={() => setOpen(true)}
        className="block font-bold text-3xl my-10 mx-auto bg-[#99621e] text-white rounded-[40px] w-[522px] h-[143px]"
      >
        Залишити коментар
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <form onSubmit={submitReview} className="bg-white rounded-2xl w-full max-w-[640px] p-6 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Залиште свій відгук</h3>

            <label className="block mb-2 text-sm font-medium">
              Фото (JPG/PNG/WebP, необов’язково)
            </label>
            {imgPreview && (
              <NextImage
                src={imgPreview}
                alt="Превʼю"
                width={800}
                height={500}
                className="w-full h-56 object-cover rounded-xl mb-3"
                unoptimized
              />
            )}
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={onFileChange}
              className="block w-full mb-2"
            />
            {fileError && <p className="text-red-600 text-sm mb-3">{fileError}</p>}

            <label className="block mb-2 text-sm font-medium">Ваш відгук</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full border rounded-xl p-3 mb-5"
              placeholder="Напишіть ваш коментар…"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Скасувати
              </button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-[#99621e] text-white">
                Відправити
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
