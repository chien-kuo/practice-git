import React, { useState } from 'react';
import { Send, Loader2, ChevronDown } from 'lucide-react';
import { useSurvey } from '../hooks/useSurvey';
import { useStore } from '../store/useStore';
import { HOUSE_NUMBERS } from '../utils/constants';

const SurveyForm: React.FC = () => {
  const { user } = useStore();
  const { submitOpinion } = useSurvey();
  const [selectedHouse, setSelectedHouse] = useState(HOUSE_NUMBERS[0]);
  const [opinion, setOpinion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!opinion.trim()) return alert("請輸入您的意見");
    
    setSubmitting(true);
    try {
      await submitOpinion(Number(selectedHouse), opinion);
      setOpinion('');
      alert("提交成功！");
    } catch (err: any) {
      alert("提交失敗：" + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-700 mb-6 border-b pb-2">填寫意見</h2>
      <div className="space-y-5">
        <div>
          <label className="block text-gray-600 font-medium mb-2">1. 門牌號碼</label>
          <div className="relative">
            <select 
              value={selectedHouse}
              onChange={(e) => setSelectedHouse(Number(e.target.value))}
              data-testid="house-select"
              className="w-full border border-gray-300 rounded p-3 appearance-none bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            >
              {HOUSE_NUMBERS.map(n => <option key={n} value={n}>{n} 號</option>)}
            </select>
            <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-gray-600 font-medium mb-2">2. 您的意見</label>
          <textarea 
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            rows={4}
            placeholder="請輸入建議..."
            data-testid="opinion-input"
            className="w-full border border-gray-300 rounded p-3 bg-gray-50 focus:outline-none focus:border-blue-500 focus:bg-white transition"
          ></textarea>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={submitting || !user}
          data-testid="submit-button"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          {!user ? '連線中...' : (submitting ? '處理中...' : '送出資料')}
        </button>
      </div>
    </div>
  );
};


export default SurveyForm;
