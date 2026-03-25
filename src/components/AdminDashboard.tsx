import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { useSurvey } from '../hooks/useSurvey';
import { FileDown, FileSpreadsheet, Trash2, Wrench } from 'lucide-react';
import { HOUSE_NUMBERS, ODD_HOUSES, EVEN_HOUSES } from '../utils/constants';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const StatusCell: React.FC<{ houseNum: number, isDone: boolean }> = ({ houseNum, isDone }) => {
  const isDoubleHeight = houseNum === 7;
  const heightClass = isDoubleHeight ? 'h-[4.25rem]' : 'h-8';

  return (
    <div className={`${heightClass} mb-1 flex items-center justify-center text-sm font-bold rounded border transition-colors duration-300
      ${isDone 
        ? 'bg-blue-600 text-white border-blue-700 shadow-sm' 
        : 'bg-white text-gray-400 border-gray-200'}`}
    >
      {houseNum}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { dataList, user } = useStore();
  const { clearAllData } = useSurvey();

  const completedHouseNumbers = useMemo(() => {
    return new Set(dataList.map(item => item.houseNumber));
  }, [dataList]);

  const progressPercentage = useMemo(() => {
    if (HOUSE_NUMBERS.length === 0) return 0;
    return Math.round((completedHouseNumbers.size / HOUSE_NUMBERS.length) * 100);
  }, [completedHouseNumbers]);

  const handleExportCSV = () => {
    const headers = ["門牌號碼,您的意見,最後更新時間"];
    const rows = dataList.map(row => {
      const time = row.updatedAt ? new Date(row.updatedAt.seconds * 1000).toLocaleString('zh-TW') : '';
      const safeOpinion = `"${row.opinion.replace(/"/g, '""')}"`;
      return `${row.houseNumber},${safeOpinion},${time}`;
    });
    const csvContent = "\uFEFF" + [headers, ...rows].join('\n'); 
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `opinion_export_${new Date().getTime()}.csv`;
    link.click();
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const tempContainer = document.createElement('div');
    Object.assign(tempContainer.style, {
      position: 'fixed',
      left: '-9999px',
      width: '210mm',
      minHeight: '297mm',
      padding: '20mm',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      boxSizing: 'border-box',
      fontFamily: "'Noto Sans TC', sans-serif"
    });
    document.body.appendChild(tempContainer);

    try {
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i];
        tempContainer.innerHTML = `
          <div style="font-size: 60px; font-weight: bold; color: #0000FF; margin-bottom: 40px; text-align: center; line-height: 1.2;">
            【 ${item.houseNumber}號 】
          </div>
          <div style="font-size: 80px; font-weight: bold; color: #000000; text-align: center; word-wrap: break-word; max-width: 170mm; line-height: 1.4;">
            ${item.opinion}
          </div>
        `;

        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        if (i > 0) doc.addPage();
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }
      doc.save('community_opinions.pdf');
    } finally {
      document.body.removeChild(tempContainer);
    }
  };

  const handleClearData = async () => {
    if (!confirm("確定要清空所有資料嗎？此操作對所有使用者生效。")) return;
    try {
      await clearAllData();
      alert("資料庫已清空");
    } catch (err: any) {
      alert("清空失敗：" + err.message);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-white border-l-4 border-yellow-500 rounded shadow p-4 flex flex-wrap justify-between items-center gap-4">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <Wrench size={20} className="text-yellow-600" />
          後台操作 ({user?.email})
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            disabled={dataList.length === 0}
            className="bg-green-600 text-white w-11 h-10 flex items-center justify-center rounded hover:bg-green-700 disabled:opacity-50 shadow transition"
            title="匯出 CSV"
          >
            <FileSpreadsheet size={20} />
          </button>
          <button
            onClick={handleExportPDF}
            disabled={dataList.length === 0}
            className="bg-blue-600 text-white w-11 h-10 flex items-center justify-center rounded hover:bg-blue-700 disabled:opacity-50 shadow transition"
            title="匯出 PDF"
          >
            <FileDown size={20} />
          </button>
          <button
            onClick={handleClearData}
            disabled={dataList.length === 0}
            className="bg-red-600 text-white w-11 h-10 flex items-center justify-center rounded hover:bg-red-700 disabled:opacity-50 shadow transition"
            title="清空資料庫"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow-lg p-6">
        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">填寫進度總覽</h3>
        <div className="flex justify-center">
          <div className="flex gap-1 p-2 bg-gray-100 rounded-lg border border-gray-300">
            <div className="w-16 flex flex-col">
              <div className="h-8 mb-1 bg-gray-300 text-gray-700 font-bold flex items-center justify-center rounded text-xs">A區</div>
              {ODD_HOUSES.map(n => (
                <StatusCell key={`odd-${n}`} houseNum={n} isDone={completedHouseNumbers.has(n)} />
              ))}
            </div>
            <div className="w-16 flex flex-col">
              <div className="h-8 mb-1 bg-gray-300 text-gray-700 font-bold flex items-center justify-center rounded text-xs">B區</div>
              {EVEN_HOUSES.map(n => (
                <StatusCell key={`even-${n}`} houseNum={n} isDone={completedHouseNumbers.has(n)} />
              ))}
            </div>
            <div className="w-20 flex flex-col relative bg-gray-200 rounded overflow-hidden border border-gray-300 mx-1">
              <div className="h-8 mb-1 sticky top-0 w-full z-10 flex items-center justify-center font-bold text-gray-800 bg-white/50 backdrop-blur-sm border-b border-gray-300 text-sm">
                {progressPercentage}%
              </div>
              <div className="relative w-full flex-grow">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-green-400 progress-bar-fill shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                  style={{ height: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-3 text-xs text-gray-500">
          <span className="inline-block w-3 h-3 bg-blue-600 rounded mr-1 align-middle"></span>已完成
          <span className="inline-block w-3 h-3 bg-white border border-gray-300 rounded ml-3 mr-1 align-middle"></span>未填寫
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
