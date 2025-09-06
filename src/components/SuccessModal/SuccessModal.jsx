'use client';
import { useEffect } from "react";
import { FaCheck } from "react-icons/fa6";

export default function SuccessModal({ open, onClose }) {

  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
   
      <button
        aria-label="Закрити"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-[#fff3e6] p-8 shadow-2xl">
      
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#99621e]/70 hover:text-[#99621e]"
          aria-label="Закрити"
        >
          ✕
        </button>

        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-white shadow">
          <FaCheck className="text-2xl text-[#99621e]" />
        </div>

        <h3 className="text-center text-xl font-extrabold">
          Ваша заявка успішно надіслана
        </h3>
        <p className="mt-2 text-center text-sm opacity-75">
          Вся інформація буде надіслана вам на пошту.
          Дякуємо, що допомагаєте зробити світ кращим.
        </p>
      </div>
    </div>
  );
}
