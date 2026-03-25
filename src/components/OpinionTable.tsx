import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { useSurvey } from '../hooks/useSurvey';
import { Loader2, Trash2 } from 'lucide-react';

const OpinionTable: React.FC = () => {
  const { dataList, isLoading, isAdmin, selectedIds, setSelectedIds } = useStore();
  const { deleteSelected } = useSurvey();

  const [sortKey, setSortKey] = useState<'houseNumber' | 'updatedAt'>('houseNumber');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const selectedRows = selectedIds;
  const setSelectedRows = setSelectedIds;

  const sortedData = useMemo(() => {
    const arr = [...dataList];
    arr.sort((a, b) => {
      if (sortKey === 'houseNumber') {
        return (a.houseNumber - b.houseNumber) * sortDir;
      }
      const aTime = a.updatedAt?.seconds ?? 0;
      const bTime = b.updatedAt?.seconds ?? 0;
      return (aTime - bTime) * sortDir;
    });
    return arr;
  }, [dataList, sortKey, sortDir]);

  const toggleSort = (key: 'houseNumber' | 'updatedAt') => {
    if (sortKey === key) {
      setSortDir(prev => prev === 1 ? -1 : 1);
    } else {
      setSortKey(key);
      setSortDir(key === 'houseNumber' ? 1 : -1);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedRows(
      selectedRows.includes(id) ? selectedRows.filter(x => x !== id) : [...selectedRows, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedData.map(i => i.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedRows.length === 0) return;
    if (!confirm(`確定要刪除 ${selectedRows.length} 筆資料嗎？`)) return;
    
    try {
      await deleteSelected(selectedRows);
      setSelectedRows([]);
      alert("刪除成功");
    } catch (err: any) {
      alert("刪除失敗：" + err.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-700">即時意見看板</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            {dataList.length} 筆資料
          </span>
          {isAdmin && selectedRows.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="text-red-600 hover:text-red-800 transition flex items-center gap-1 text-sm font-bold"
            >
              <Trash2 size={16} /> 刪除所選 ({selectedRows.length})
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
              {isAdmin && (
                <th className="px-6 py-3 font-semibold w-12 border-b">
                  <input 
                    type="checkbox" 
                    className="form-checkbox" 
                    onChange={toggleSelectAll} 
                    checked={sortedData.length > 0 && selectedRows.length === sortedData.length} 
                  />
                </th>
              )}
              <th className="px-6 py-3 font-semibold border-b">
                <button onClick={() => toggleSort('houseNumber')} className="flex items-center gap-2">
                  門牌號碼
                  {sortKey === 'houseNumber' && (<span>{sortDir === 1 ? '▲' : '▼'}</span>)}
                </button>
              </th>
              <th className="px-6 py-3 font-semibold border-b">內容</th>
              {isAdmin && (
                <th className="px-6 py-3 font-semibold border-b text-right">
                  <button onClick={() => toggleSort('updatedAt')} className="flex items-center gap-2 justify-end w-full">
                    最後更新時間
                    {sortKey === 'updatedAt' && (<span>{sortDir === 1 ? '▲' : '▼'}</span>)}
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={isAdmin ? 4 : 2} className="px-6 py-12 text-center text-gray-500">
                  <Loader2 className="animate-spin inline-block mb-2" size={32} />
                  <p>同步資料庫中...</p>
                </td>
              </tr>
            ) : dataList.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 4 : 2} className="px-6 py-12 text-center text-gray-400 bg-gray-50/30">
                  目前尚無資料，請成為第一位填寫者。
                </td>
              </tr>
            ) : (
              sortedData.map(item => (
                <tr key={item.id} className="hover:bg-blue-50 transition fade-in" data-testid="opinion-row">
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(item.id)} 
                        onChange={() => toggleSelect(item.id)} 
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <span 
                      className="inline-block bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm"
                      data-testid="house-number"
                    >
                      {item.houseNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 break-words" data-testid="opinion-text">{item.opinion}</td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-gray-600 text-sm text-right">
                      {item.updatedAt ? new Date(item.updatedAt.seconds * 1000).toLocaleString('zh-TW') : '-'}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpinionTable;
