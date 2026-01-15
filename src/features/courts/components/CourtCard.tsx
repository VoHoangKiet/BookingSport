import { Link } from 'react-router-dom';
import { Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import type { Court } from '@/types';
import { MapPin, Clock, Dribbble } from 'lucide-react';

interface CourtCardProps {
  court: Court;
}

export function CourtCard({ court }: CourtCardProps) {
  const minPrice = court.san_cons?.reduce((min, sub) => 
    Math.min(min, sub.gia_co_ban), Infinity
  ) || 0;

  return (
    <Link to={`/courts/${court.ma_san}`}>
      <Card className="overflow-hidden h-full border border-gray-100 rounded-lg hover:border-emerald-500 transition-all shadow-none">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {court.anh_san ? (
            <img
              src={court.anh_san}
              alt={court.ten_san}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Dribbble className="w-12 h-12 text-gray-200" />
            </div>
          )}
          {court.bo_mon && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-emerald-600 text-white text-[10px] font-semibold rounded shadow-sm">
              {court.bo_mon.ten_bo_mon}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {court.ten_san}
          </h3>
          
          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-4">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">{court.dia_chi}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {minPrice && minPrice !== Infinity ? (
                <>
                  <span className="text-[10px] font-medium text-gray-500 block">Giá từ</span>
                  <p className="text-xl font-bold text-emerald-600 leading-none">
                    {formatCurrency(minPrice)}
                    <span className="text-xs font-normal text-gray-500 ml-1">/giờ</span>
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-emerald-600">
                  Xem chi tiết sân
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium self-end bg-gray-50 px-2 py-1 rounded">
              <Clock className="w-3.5 h-3.5" />
              <span>{court.gio_mo_cua?.slice(0, 5)} - {court.gio_dong_cua?.slice(0, 5)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
