import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, closeSizeGuide, sizeGuideCategory } = useShop();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [tab, setTab] = useState<'men' | 'women' | 'shoes'>(sizeGuideCategory || 'men');

  if (!isSizeGuideOpen) return null;

  const menSizes = [
    { size: '46 (S)', chestCm: '92-96', chestIn: '36-38', waistCm: '78-82', waistIn: '30-32', hipsCm: '94-98', hipsIn: '37-38' },
    { size: '48 (M)', chestCm: '97-101', chestIn: '38-40', waistCm: '83-87', waistIn: '32-34', hipsCm: '99-103', hipsIn: '39-40' },
    { size: '50 (L)', chestCm: '102-106', chestIn: '40-42', waistCm: '88-92', waistIn: '34-36', hipsCm: '104-108', hipsIn: '41-42' },
    { size: '52 (XL)', chestCm: '107-111', chestIn: '42-44', waistCm: '93-97', waistIn: '36-38', hipsCm: '109-113', hipsIn: '43-44' },
  ];

  const womenSizes = [
    { size: 'XS (34)', bustCm: '80-84', bustIn: '31-33', waistCm: '62-66', waistIn: '24-26', hipsCm: '86-90', hipsIn: '34-35' },
    { size: 'S (36)', bustCm: '85-89', bustIn: '33-35', waistCm: '67-71', waistIn: '26-28', hipsCm: '91-95', hipsIn: '36-37' },
    { size: 'M (38)', bustCm: '90-94', bustIn: '35-37', waistCm: '72-76', waistIn: '28-30', hipsCm: '96-100', hipsIn: '38-39' },
    { size: 'L (40)', bustCm: '95-99', bustIn: '37-39', waistCm: '77-81', waistIn: '30-32', hipsCm: '101-105', hipsIn: '40-41' },
  ];

  const shoeSizes = [
    { eu: '38 EU', uk: '5', usMen: '6', usWomen: '7.5', lengthCm: '24.5', lengthIn: '9.6' },
    { eu: '39 EU', uk: '6', usMen: '7', usWomen: '8.5', lengthCm: '25.2', lengthIn: '9.9' },
    { eu: '40 EU', uk: '6.5', usMen: '7.5', usWomen: '9', lengthCm: '25.8', lengthIn: '10.1' },
    { eu: '41 EU', uk: '7.5', usMen: '8.5', usWomen: '10', lengthCm: '26.5', lengthIn: '10.4' },
    { eu: '42 EU', uk: '8', usMen: '9', usWomen: '10.5', lengthCm: '27.1', lengthIn: '10.7' },
    { eu: '43 EU', uk: '9', usMen: '10', usWomen: '11.5', lengthCm: '27.8', lengthIn: '10.9' },
    { eu: '44 EU', uk: '9.5', usMen: '10.5', usWomen: '12', lengthCm: '28.4', lengthIn: '11.2' },
    { eu: '45 EU', uk: '10.5', usMen: '11.5', usWomen: '13', lengthCm: '29.1', lengthIn: '11.5' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={closeSizeGuide} className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-lg shadow-2xl border border-stone-200 overflow-hidden z-10 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <Ruler size={18} className="text-[#A88756]" />
              <h3 
                className="text-2xl font-light text-[#0C0C0D]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Atelier Size & Proportions Guide
              </h3>
            </div>
            <button onClick={closeSizeGuide} className="p-1 text-stone-400 hover:text-black">
              <X size={20} />
            </button>
          </div>

          {/* Department Tabs & Unit Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {(['men', 'women', 'shoes'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold rounded transition-colors ${
                    tab === t ? 'bg-[#0C0C0D] text-white' : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-stone-200 p-1 rounded">
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded ${
                  unit === 'cm' ? 'bg-white text-black shadow-xs' : 'text-stone-600'
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 text-xs font-mono font-semibold rounded ${
                  unit === 'in' ? 'bg-white text-black shadow-xs' : 'text-stone-600'
                }`}
              >
                IN
              </button>
            </div>
          </div>

          {/* Tables */}
          <div className="border border-stone-200 rounded overflow-hidden">
            {tab === 'men' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Size (EU / US)</th>
                    <th className="p-3">Chest ({unit.toUpperCase()})</th>
                    <th className="p-3">Waist ({unit.toUpperCase()})</th>
                    <th className="p-3">Hips ({unit.toUpperCase()})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-mono">
                  {menSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900">{row.size}</td>
                      <td className="p-3 text-stone-600">{unit === 'cm' ? row.chestCm : row.chestIn}</td>
                      <td className="p-3 text-stone-600">{unit === 'cm' ? row.waistCm : row.waistIn}</td>
                      <td className="p-3 text-stone-600">{unit === 'cm' ? row.hipsCm : row.hipsIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'women' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Size (EU / UK)</th>
                    <th className="p-3">Bust ({unit.toUpperCase()})</th>
                    <th className="p-3">Waist ({unit.toUpperCase()})</th>
                    <th className="p-3">Hips ({unit.toUpperCase()})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-mono">
                  {womenSizes.map((row) => (
                    <tr key={row.size} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900">{row.size}</td>
                      <td className="p-3 text-stone-600">{unit === 'cm' ? row.bustCm : row.bustIn}</td>
                      <td className="p-3 text-stone-600">{unit === 'cm' ? row.waistCm : row.waistIn}</td>
                      <td className="p-3 text-stone-600">{unit === 'cm' ? row.hipsCm : row.hipsIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'shoes' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-600 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">EU</th>
                    <th className="p-3">UK</th>
                    <th className="p-3">US (M / W)</th>
                    <th className="p-3">Foot Length ({unit.toUpperCase()})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-mono">
                  {shoeSizes.map((row) => (
                    <tr key={row.eu} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900">{row.eu}</td>
                      <td className="p-3 text-stone-600">{row.uk}</td>
                      <td className="p-3 text-stone-600">{row.usMen} / {row.usWomen}</td>
                      <td className="p-3 text-stone-600">{unit === 'cm' ? row.lengthCm : row.lengthIn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="text-[11px] text-stone-500 bg-stone-100 p-3 rounded">
            <strong>Atelier Advice:</strong> All ZAVIK garments are tailored true to European standards. If you are between two sizes, we recommend selecting the larger size for a relaxed drape or contacting our concierge for bespoke sizing guidance.
          </div>
        </div>
      </div>
    </div>
  );
};
