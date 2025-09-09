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
{page === 1 && (
  <>
    {/* Герой-блок: фото + великий текст */}
    <div className="mt-[180px] flex flex-col md:flex-row items-start gap-12">
      <NextImage
        src={main}
        alt="Decorative picture with dog"
        width={413}
        height={478}
        className="shrink-0 rounded-lg object-cover"
      />
      <p className="font-medium text-2xl leading-[1.6] md:flex-1 max-w-[700px]">
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

    {/* 4 статичних відгуки */}
    <div className="mt-[100px] grid grid-cols-1 md:grid-cols-2 gap-[100px]">
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
  </>
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
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    onClick={(e) => {
      if (e.target === e.currentTarget) setOpen(false);
    }}
  >
    <form
      onSubmit={submitReview}
      className="
        w-full max-w-[560px]
        bg-white rounded-[20px]
        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        border border-[#E6E6E6]
        px-6 py-5
      "
    >
      {/* Заголовок */}
      <h3 className="text-[20px] leading-[1.2] font-medium text-[#2A2A2A] mb-4 text-center">
        Залиште свій відгук
      </h3>

      {/* Лейбл до фото */}
      <label className="block mb-2 text-[14px] leading-[1.2] text-[#6F6F6F]">
        Додайте фото (необов’язково)
      </label>

      {/* Зона завантаження (плейсхолдер з пунктиром) */}
      <div className="relative mb-4">
        <div
          className="
            h-[170px] w-full
            rounded-[16px]
            bg-[#F3F3F3]
            border border-dashed border-[#CFCFCF]
            flex items-center justify-center
          "
        >
          {!imgPreview && (
            <div className="flex flex-col items-center gap-2 select-none">
              <div
                className="
                  w-10 h-10 rounded-full
                  border border-[#BDBDBD]
                  flex items-center justify-center
                  text-[#8B8B8B] text-2xl
                "
              >
                +
              </div>
              <span className="text-[12px] text-[#8B8B8B]">
                JPG / PNG / WebP
              </span>
            </div>
          )}

          {imgPreview && (
            // використовую NextImage, як і в тебе
            <NextImage
              src={imgPreview}
              alt="Превʼю"
              width={1000}
              height={600}
              className="absolute inset-0 w-full h-full object-cover rounded-[16px]"
              unoptimized
            />
          )}
        </div>

        {/* Ховаємо input, але робимо клікабельною всю зону */}
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={onFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
          title=""
          aria-label="Завантажити фото"
        />
      </div>

      {fileError && (
        <p className="text-[#D92D20] text-[12px] mb-4">{fileError}</p>
      )}

      {/* Лейбл до textarea */}
      <label className="block mb-2 text-[14px] leading-[1.2] text-[#6F6F6F]">
        Ваш відгук
      </label>

      {/* Поле вводу тексту */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder="Напишіть ваш коментар…"
        className="
          w-full
          rounded-[20px]
          border-2 border-[#CFCFCF]
          focus:border-[#B8B8B8] focus:outline-none
          px-4 py-3
          text-[14px] text-[#2A2A2A]
          placeholder:text-[#B3B3B3]
          mb-5
        "
      />

      {/* Кнопки */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(false);
          }}
          className="
            h-[44px] px-5
            rounded-[20px]
            border border-[#000000]
            text-[14px] font-medium text-[#2A2A2A]
            bg-white
            hover:bg-[#F7F7F7] transition
          "
        >
          Скасувати
        </button>

        <button
          type="submit"
          className="
            h-[44px] px-6
            rounded-[20px]
            text-[14px] font-semibold
            bg-[#99621e] text-white
            shadow-[0_2px_0_rgba(0,0,0,0.25)] 
            hover:opacity-95 active:translate-y-[1px] transition
          "
        >
          Відправити
        </button>
      </div>
    </form>
  </div>
)}

    </div>
  );
}
