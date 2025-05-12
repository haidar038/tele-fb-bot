// parser.js
// Modul untuk deteksi keyword dan ekstraksi harga

// Kamus satuan harga
const unitMap = {
    rb: 1e3,
    k: 1e3,
    jt: 1e6,
    juta: 1e6,
    j: 1e6,
};

// Pola regex untuk penangkapan harga
const pricePatterns = [
    // dengan unit (misal: 1.5jt, 300rb)
    /([0-9]+(?:[\.,][0-9]+)?)\s*(rb|k|jt|juta|j)\b/gi,
    // format Rp dengan titik ribuan (misal: Rp 200.000)
    /Rp\s*([0-9]{1,3}(?:\.[0-9]{3})*)(?!\s*(rb|k|jt|juta|j))/gi,
];

function hasKeyword(text, keywords) {
    const lower = text.toLowerCase();
    return keywords.some((k) => lower.includes(k.toLowerCase()));
}

function extractPrice(text) {
    for (let i = 0; i < pricePatterns.length; i++) {
        const pat = pricePatterns[i];
        pat.lastIndex = 0;
        const match = pat.exec(text);
        if (match) {
            let numStr;
            if (i === 0) {
                // Pattern dengan unit: hanya ganti koma menjadi titik
                numStr = match[1].replace(",", ".");
            } else {
                // Pattern Rp: hapus semua titik sebagai pemisah ribuan
                numStr = match[1].replace(/\./g, "");
            }
            let num = parseFloat(numStr);
            if (isNaN(num)) return null;
            const unit = (match[2] || "").toLowerCase();
            if (unit && unitMap[unit]) {
                num *= unitMap[unit];
            }
            return Math.round(num);
        }
    }
    return null;
}

function inRange(price, range) {
    return price >= range.min && price <= range.max;
}

module.exports = { hasKeyword, extractPrice, inRange };
