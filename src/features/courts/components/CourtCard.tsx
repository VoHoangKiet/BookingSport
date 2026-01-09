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
      <Card hoverable className="overflow-hidden h-full">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {court.anh_san ? (
            <img
              src={court.anh_san}
              alt={court.ten_san}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100">
              <Dribbble className="w-16 h-16 text-emerald-300" />
            </div>
          )}
          {court.bo_mon && (
            <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-emerald-700 flex items-center gap-1">
              <Dribbble className="w-3 h-3" />
              {court.bo_mon.ten_bo_mon}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
            {court.ten_san}
          </h3>
          
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{court.dia_chi}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {minPrice && minPrice !== Infinity ? (
                <>
                  <span className="text-xs text-gray-500">Từ</span>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(minPrice)}
                    <span className="text-sm font-normal text-gray-500">/giờ</span>
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-emerald-600">
                  Xem chi tiết giá
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{court.gio_mo_cua?.slice(0, 5)} - {court.gio_dong_cua?.slice(0, 5)}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
