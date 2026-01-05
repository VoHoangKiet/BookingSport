import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { courtsApi, sportsApi } from '@/api';
import { CourtCard } from '../components/CourtCard';
import { Select, CardSkeleton, Button } from '@/components/ui';
import { useState, useEffect } from 'react';
import { Search, X, Filter, Dribbble } from 'lucide-react';

export default function CourtsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSport, setSelectedSport] = useState(searchParams.get('ma_bo_mon') || '');

  const { data: sports } = useQuery({
    queryKey: ['sports'],
    queryFn: sportsApi.getAll,
  });

  const { data: courts, isLoading } = useQuery({
    queryKey: ['courts', 'search', selectedSport, searchQuery],
    queryFn: () => courtsApi.search({
      ma_bo_mon: selectedSport ? Number(selectedSport) : undefined,
      q: searchQuery || undefined,
    }),
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedSport) params.set('ma_bo_mon', selectedSport);
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
  }, [selectedSport, searchQuery, setSearchParams]);

  const sportOptions = sports?.map(s => ({
    value: s.ma_bo_mon,
    label: s.ten_bo_mon,
  })) || [];

  const hasFilters = searchQuery || selectedSport;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Tìm sân thể thao
          </h1>
          <p className="text-gray-600 text-lg">
            Khám phá và đặt sân phù hợp với bạn
          </p>
        </div>

        {/* Modern Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            {/* Search Input */}
            <div className="lg:col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tìm kiếm
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Nhập tên sân bạn muốn tìm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white hover:border-gray-300 placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Sport Filter */}
            <div className="lg:col-span-4 relative">
              <Select
                label="Bộ môn thể thao"
                options={sportOptions}
                placeholder="Tất cả bộ môn"
                value={selectedSport}
                onChange={(value) => setSelectedSport(value)}
              />
            </div>

            {/* Buttons */}
            <div className="lg:col-span-3 flex gap-2">
              {hasFilters && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSport('');
                  }}
                  className="flex-1 text-gray-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
              <Button className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </div>

          {/* Active Filters Tags */}
          {hasFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Filter className="w-4 h-4" />
                  Đang lọc:
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                    <Search className="w-3 h-3" />
                    "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-1 hover:text-emerald-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedSport && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <Dribbble className="w-3 h-3" />
                    {sportOptions.find(s => String(s.value) === selectedSport)?.label}
                    <button
                      onClick={() => setSelectedSport('')}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : courts && courts.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold text-emerald-600">{courts.length}</span> sân
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Sắp xếp theo:</span>
                <button className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                  Phổ biến
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((court) => (
                <CourtCard key={court.ma_san} court={court} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sân</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Không có sân nào phù hợp với tiêu chí tìm kiếm. Hãy thử thay đổi bộ lọc hoặc từ khóa.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedSport('');
              }}
            >
              Xóa bộ lọc và thử lại
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
