"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, Edit, Key, Trash2 } from "lucide-react";

export function ActionMenu({ user, onClose, onViewDetail, onEdit, onPasswordReset, onDelete, buttonRef }) {
  const menuRef = useRef();
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    function calculatePosition() {
      if (buttonRef?.current && menuRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const menuRect = menuRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Cek apakah ada cukup ruang di bawah
        const spaceBelow = viewportHeight - buttonRect.bottom;
        const spaceAbove = buttonRect.top;
        
        let topPosition;
        if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
          // Tampilkan di atas jika ruang di bawah tidak cukup
          topPosition = buttonRect.top - menuRect.height - 8;
        } else {
          // Tampilkan di bawah seperti biasa
          topPosition = buttonRect.bottom + 8;
        }
        
        setPosition({
          top: topPosition,
          right: window.innerWidth - buttonRect.right
        });
      }
    }

    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    window.addEventListener('scroll', calculatePosition);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, buttonRef]);

  const menuItems = [
    { 
      label: "Lihat Detail", 
      icon: Eye, 
      onClick: () => {
        onViewDetail(user);
        onClose();
      },
      color: "text-gray-700 hover:bg-gray-100"
    },
    { 
      label: "Edit Data", 
      icon: Edit, 
      onClick: () => {
        onEdit(user);
        onClose();
      },
      color: "text-gray-700 hover:bg-gray-100"
    },
    { 
      label: "Reset Password", 
      icon: Key, 
      onClick: () => {
        onPasswordReset(user);
        onClose();
      },
      color: "text-gray-700 hover:bg-gray-100"
    },
    { 
      label: "Hapus Pengguna", 
      icon: Trash2, 
      onClick: () => {
        onDelete(user);
        onClose();
      },
      color: "text-red-600 hover:bg-red-50",
      divider: true
    }
  ];

  return (
    <div 
      ref={menuRef}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        right: `${position.right}px`,
        zIndex: 50
      }}
      className="w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
    >
      {menuItems.map((item, index) => (
        <div key={index}>
          {item.divider && <div className="border-t border-gray-200 my-1"></div>}
          <button
            onClick={item.onClick}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm ${item.color}`}
          >
            <item.icon size={14} />
            {item.label}
          </button>
        </div>
      ))}
    </div>
  );
}