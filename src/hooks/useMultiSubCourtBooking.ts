import { useState, useCallback, useMemo } from 'react';
import type { SubCourtSelection, TimeSlotSelection } from '@/types/booking.types';
import type { SubCourt, TimeSlot } from '@/types';

export function useMultiSubCourtBooking() {
  const [selections, setSelections] = useState<SubCourtSelection[]>([]);

  // Toggle sub-court selection
  const toggleSubCourt = useCallback((subCourt: SubCourt) => {
    setSelections((prev) => {
      const exists = prev.find((s) => s.ma_san_con === subCourt.ma_san_con);
      if (exists) {
        // Remove if already selected
        return prev.filter((s) => s.ma_san_con !== subCourt.ma_san_con);
      } else {
        // Add new selection
        return [
          ...prev,
          {
            ma_san_con: subCourt.ma_san_con,
            ten_san_con: subCourt.ten_san_con,
            gia_co_ban: subCourt.gia_co_ban,
            selected_slots: [],
          },
        ];
      }
    });
  }, []);

  // Toggle time slot for a specific sub-court
  const toggleSlot = useCallback(
    (ma_san_con: number, slot: TimeSlot, gia_co_ban: number) => {
      setSelections((prev) =>
        prev.map((selection) => {
          if (selection.ma_san_con !== ma_san_con) return selection;

          const slotExists = selection.selected_slots.find(
            (s) => s.ma_khung_gio === slot.ma_khung_gio
          );

          if (slotExists) {
            // Remove slot
            return {
              ...selection,
              selected_slots: selection.selected_slots.filter(
                (s) => s.ma_khung_gio !== slot.ma_khung_gio
              ),
            };
          } else {
            // Add slot
            return {
              ...selection,
              selected_slots: [
                ...selection.selected_slots,
                {
                  ma_khung_gio: slot.ma_khung_gio,
                  gio_bat_dau: slot.gio_bat_dau,
                  gio_ket_thuc: slot.gio_ket_thuc,
                  phu_phi: slot.phu_phi,
                  gia: gia_co_ban + slot.phu_phi,
                },
              ].sort((a, b) => a.gio_bat_dau.localeCompare(b.gio_bat_dau)),
            };
          }
        })
      );
    },
    []
  );

  // Remove a specific sub-court
  const removeSubCourt = useCallback((ma_san_con: number) => {
    setSelections((prev) => prev.filter((s) => s.ma_san_con !== ma_san_con));
  }, []);

  // Clear all selections
  const clearAll = useCallback(() => {
    setSelections([]);
  }, []);

  // Check if sub-court is selected
  const isSubCourtSelected = useCallback(
    (ma_san_con: number) => {
      return selections.some((s) => s.ma_san_con === ma_san_con);
    },
    [selections]
  );

  // Check if slot is selected for a sub-court
  const isSlotSelected = useCallback(
    (ma_san_con: number, ma_khung_gio: number) => {
      const selection = selections.find((s) => s.ma_san_con === ma_san_con);
      return selection?.selected_slots.some((s) => s.ma_khung_gio === ma_khung_gio) || false;
    },
    [selections]
  );

  // Calculate total price
  const totalPrice = useMemo(() => {
    return selections.reduce((total, selection) => {
      const subTotal = selection.selected_slots.reduce((sum, slot) => sum + slot.gia, 0);
      return total + subTotal;
    }, 0);
  }, [selections]);

  // Get total slots count
  const totalSlotsCount = useMemo(() => {
    return selections.reduce((count, selection) => count + selection.selected_slots.length, 0);
  }, [selections]);

  // Validate: at least one sub-court with slots
  const isValid = useMemo(() => {
    return selections.length > 0 && selections.every((s) => s.selected_slots.length > 0);
  }, [selections]);

  return {
    selections,
    toggleSubCourt,
    toggleSlot,
    removeSubCourt,
    clearAll,
    isSubCourtSelected,
    isSlotSelected,
    totalPrice,
    totalSlotsCount,
    isValid,
  };
}
