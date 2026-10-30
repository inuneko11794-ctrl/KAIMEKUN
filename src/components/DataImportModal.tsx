import React, { useState } from 'react';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (jsonData: any) => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  // ファイル読み込み処理
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        
        // 親コンポーネントにデータを渡す
        onImportSuccess(jsonData);

        alert(`${file.name} の読み込み・システムアップデートに成功しました！`);
        setFileName(null);
        onClose();
      } catch (error) {
        console.error("JSONパースエラー:", error);
        alert("JSONファイルの解析に失敗しました。正しいフォーマットか確認してください。");
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-slate-800/50">
          <h2 className="font-bold text-slate-100 text-sm">
            システム・アップデート (データ読込)
          </h2>
          <button
            onClick={() => {
              setFileName(null);
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200 font-bold text-base px-2 py-1 transition"
          >
            ✕
          </button>
        </div>

        {/* モーダルボディ */}
        <div className="p-5">
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            バックアップや過去の予想ノート（<code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400 border border-slate-700">.json</code>）を選択して、バトルバンク君のデータを更新・学習させます。
          </p>

          {/* ファイル選択・ドロップ枠 */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-900 transition group">
            <div className="flex flex-col items-center justify-center pt-4 pb-5 px-4 text-center">
              <span className="text-2xl mb-1 group-hover:scale-110 transition transform">📁</span>
              <p className="text-xs font-semibold text-slate-200">
                クリックしてJSONファイルを選択
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                mansha-note や byn3_backup など
              </p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".json" 
              onChange={handleFileUpload}
            />
          </label>

          {/* 選択中ファイル名の表示 */}
          {fileName && (
            <div className="mt-3 p-2.5 bg-emerald-950/80 border border-emerald-800/60 rounded-lg text-xs text-emerald-300 font-medium truncate">
              選択中: {fileName}
            </div>
          )}
        </div>

        {/* モーダルフッター */}
        <div className="flex items-center justify-end px-5 py-3 bg-slate-800/50 border-t border-slate-700">
          <button
            onClick={() => {
              setFileName(null);
              onClose();
            }}
            className="px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs rounded-lg hover:bg-slate-600 transition shadow-sm"
          >
            キャンセル
          </button>
        </div>

      </div>
    </div>
  );
};
