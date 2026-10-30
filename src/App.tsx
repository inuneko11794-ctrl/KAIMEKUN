import React, { useState, useEffect } from 'react';
import { DataImportModal } from './components/DataImportModal';

// ==========================================
// バトルバンク君 (BYN Race Analyzer) - メインアプリ
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'input' | 'analytics' | 'settings'>('dashboard');
  const [races, setRaces] = useState<any[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // 初期データ読込
  useEffect(() => {
    const saved = localStorage.getItem('byn_races_data');
    if (saved) {
      try {
        setRaces(JSON.parse(saved));
      } catch (e) {
        console.error("ローカルデータの解析失敗", e);
      }
    }
  }, []);

  // データの保存
  const saveToStorage = (newData: any[]) => {
    setRaces(newData);
    localStorage.setItem('byn_races_data', JSON.stringify(newData));
  };

  // インポート成功時のハンドラー
  const handleImportSuccess = (jsonData: any) => {
    const dataArray = Array.isArray(jsonData) ? jsonData : (jsonData.races || [jsonData]);
    saveToStorage(dataArray);
  };

  // バックアップのエクスポート
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(races, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `byn3_backup_pro_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      
      {/* ─── ヘッダー ─── */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚲</span>
          <h1 className="font-extrabold text-base sm:text-lg tracking-wider bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            バトルバンク君 <span className="text-xs font-normal text-slate-400">BYN Analyzer</span>
          </h1>
        </div>

        {/* データ読込トリガーボタン */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-lg shadow transition flex items-center gap-1 border border-slate-600"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">データ読込</span>
          </button>
        </div>
      </header>

      {/* ─── メインコンテンツエリア ─── */}
      <main className="flex-1 p-4 max-w-4xl w-full mx-auto pb-20">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-lg">
              <h2 className="text-sm font-bold text-slate-300 mb-2">📊 レース分析サマリー</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                現在の登録レース数: <span className="text-emerald-400 font-bold text-base">{races.length}</span> 件
              </p>
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={handleExportJson}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition shadow"
                >
                  バックアップ保存 (JSON)
                </button>
              </div>
            </div>

            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-lg">
              <h3 className="text-xs font-bold text-slate-400 mb-2">💡 クイックガイド</h3>
              <p className="text-xs text-slate-300">
                右上または設定タブから「データ読込」を開き、保存済みのJSONファイル（mansha-noteやbyn3_backup）をインポートして分析を再開してください。
              </p>
            </div>
          </div>
        )}

        {activeTab === 'input' && (
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-lg">
            <h2 className="text-sm font-bold text-slate-300 mb-3">📝 レース手動登録・OCR</h2>
            <p className="text-xs text-slate-400">ここにスクショ解析や手動入力フォームが配置されます。</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-lg">
            <h2 className="text-sm font-bold text-slate-300 mb-3">📈 グラフ・統計分析</h2>
            <p className="text-xs text-slate-400">三分戦・7車立てのライン割合、配当分布などがここに表示されます。</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-slate-300 mb-2">⚙️ システム管理</h2>
            <button
              onClick={() => {
                if (confirm("全データを消去しますか？")) {
                  saveToStorage([]);
                }
              }}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition shadow"
            >
              全データリセット
            </button>
          </div>
        )}

      </main>

      {/* ─── データインポート用モーダル (別コンポーネント呼び出し) ─── */}
      <DataImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* ─── ボトムナビゲーション ─── */}
      <nav className="bg-slate-800 border-t border-slate-700 fixed bottom-0 left-0 right-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-around py-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center text-xs font-bold transition ${activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-lg">📊</span>
            <span>ダッシュボード</span>
          </button>
          <button 
            onClick={() => setActiveTab('input')}
            className={`flex flex-col items-center text-xs font-bold transition ${activeTab === 'input' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-lg">📝</span>
            <span>入力・OCR</span>
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center text-xs font-bold transition ${activeTab === 'analytics' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-lg">📈</span>
            <span>分析</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center text-xs font-bold transition ${activeTab === 'settings' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-lg">⚙️</span>
            <span>設定</span>
          </button>
        </div>
      </nav>

    </div>
  );
}
