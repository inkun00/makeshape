import { useEffect, useRef, useState } from 'react';
import { getCertificateLevel } from '../data/certificateLevels';

const UPLOAD_URL = 'https://samboard.vivasam.com/studentEntry/?brdId=brd-0QN1PMGJ84W3T';
const CHARACTER_SHEET_URLS = {
  boy: [
    '/certificate-characters-boy.png',
    '/certificate-characters-boy-2.png',
    '/certificate-characters-boy-3.png',
    '/certificate-characters-boy-4.png',
    '/certificate-characters-boy-5.png'
  ],
  girl: [
    '/certificate-characters-girl.png',
    '/certificate-characters-girl-2.png',
    '/certificate-characters-girl-3.png',
    '/certificate-characters-girl-4.png',
    '/certificate-characters-girl-5.png'
  ]
};

const CHARACTER_SET_LABELS = {
  boy: '남학생 캐릭터',
  girl: '여학생 캐릭터'
};

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawText(ctx, text, x, y, maxWidth, font, color, align = 'center') {
  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y, maxWidth);
  ctx.restore();
}

function drawMathPattern(ctx) {
  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;

  for (let x = 80; x < 1320; x += 80) {
    ctx.beginPath();
    ctx.moveTo(x, 80);
    ctx.lineTo(x, 910);
    ctx.stroke();
  }

  for (let y = 90; y < 920; y += 80) {
    ctx.beginPath();
    ctx.moveTo(80, y);
    ctx.lineTo(1320, y);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = '#ec4899';
  ['x', 'y', '90°', 'Σ', '△', '↔', 'π', 'A'].forEach((symbol, index) => {
    ctx.font = `${36 + (index % 3) * 10}px Arial`;
    ctx.fillText(symbol, 120 + index * 145, 170 + (index % 2) * 635);
  });
  ctx.restore();
}

function drawGeneratedCharacter(ctx, image, levelInfo, x, y, radius = 155) {
  if (!image) return false;

  const columns = 5;
  const rows = 2;
  const tileWidth = image.naturalWidth / columns;
  const tileHeight = image.naturalHeight / rows;
  const index = levelInfo.level - 1;
  const sourceX = (index % columns) * tileWidth + tileWidth * 0.08;
  const sourceY = Math.floor(index / columns) * tileHeight + tileHeight * 0.05;
  const sourceSize = Math.min(tileWidth * 0.84, tileHeight * 0.76);

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, x - radius, y - radius, radius * 2, radius * 2);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = levelInfo.colors[0];
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  return true;
}

function drawCharacterPlaceholder(ctx, levelInfo, x, y, radius = 155, message = '캐릭터를 불러오는 중입니다') {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.strokeStyle = levelInfo.colors[0];
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  drawText(ctx, message, x, y - 10, radius * 1.6, 'bold 24px Arial', levelInfo.colors[0]);
  drawText(ctx, '잠시만 기다려 주세요', x, y + 28, radius * 1.6, '20px Arial', '#64748b');
  ctx.restore();
}

function drawCertificate(canvas, stats, characterSheet = null, characterMessage = '캐릭터를 불러오는 중입니다') {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const totalPenalty = (stats?.wrongAttempts || 0) + (stats?.hintUses || 0);
  const levelInfo = getCertificateLevel(totalPenalty);

  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#eef2ff');
  gradient.addColorStop(0.55, '#ffffff');
  gradient.addColorStop(1, '#fff7ed');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  drawMathPattern(ctx);

  ctx.strokeStyle = levelInfo.colors[0];
  ctx.lineWidth = 14;
  drawRoundedRect(ctx, 58, 58, width - 116, height - 116, 34);
  ctx.stroke();

  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, 92, 92, width - 184, height - 184, 24);
  ctx.stroke();

  drawText(ctx, '도형 이동 학습 인증서', width / 2, 160, 900, 'bold 66px Arial', '#111827');
  drawText(ctx, '모든 회전과 뒤집기 스테이지를 끝까지 해결했습니다.', width / 2, 230, 920, '30px Arial', '#475569');

  const characterDrawn = drawGeneratedCharacter(ctx, characterSheet, levelInfo, width / 2, 430, 155);
  if (!characterDrawn) {
    drawCharacterPlaceholder(ctx, levelInfo, width / 2, 430, 155, characterMessage);
  }

  drawText(ctx, `${levelInfo.level}단계 · ${levelInfo.title}`, width / 2, 640, 900, 'bold 54px Arial', levelInfo.colors[0]);
  drawText(ctx, levelInfo.subtitle, width / 2, 705, 900, 'bold 40px Arial', '#111827');
  drawText(ctx, `누적 오답 ${stats?.wrongAttempts || 0}회 · 힌트 ${stats?.hintUses || 0}회 · 총 페널티 ${totalPenalty}회`, width / 2, 775, 900, '28px Arial', '#64748b');

  const issuedAt = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  drawText(ctx, issuedAt, width / 2, 845, 900, '26px Arial', '#475569');
}

export default function CertificateModal({ open, onClose, stats }) {
  const canvasRef = useRef(null);
  const [characterSet, setCharacterSet] = useState('boy');
  const [characterVariant, setCharacterVariant] = useState(0);
  const [characterStatus, setCharacterStatus] = useState('loading');
  const characterSheetUrl = CHARACTER_SHEET_URLS[characterSet][characterVariant];
  const characterVariantCount = CHARACTER_SHEET_URLS[characterSet].length;

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    let cancelled = false;
    const canvas = canvasRef.current;
    setCharacterStatus('loading');
    drawCertificate(canvas, stats);

    const image = new Image();
    image.onload = () => {
      if (!cancelled) {
        setCharacterStatus('ready');
        drawCertificate(canvas, stats, image);
      }
    };
    image.onerror = () => {
      if (!cancelled) {
        setCharacterStatus('error');
        drawCertificate(canvas, stats, null, '캐릭터를 불러오지 못했습니다');
      }
    };
    image.src = characterSheetUrl;

    return () => {
      cancelled = true;
    };
  }, [open, stats, characterSheetUrl]);

  if (!open) return null;

  const totalPenalty = (stats?.wrongAttempts || 0) + (stats?.hintUses || 0);
  const levelInfo = getCertificateLevel(totalPenalty);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (characterStatus !== 'ready') {
      window.alert('캐릭터 이미지가 준비된 뒤 저장할 수 있습니다.');
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `makeshape-certificate-${characterSet}-${characterVariant + 1}-level-${levelInfo.level}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      const uploadWindow = window.open(UPLOAD_URL, '_blank', 'noopener,noreferrer');
      if (!uploadWindow) {
        window.location.href = UPLOAD_URL;
      }
    }, 'image/png');
  };

  return (
    <div className="certificate-backdrop" role="dialog" aria-modal="true" aria-labelledby="certificate-title">
      <div className="certificate-modal">
        <div className="certificate-header">
          <div>
            <p className="certificate-kicker">전체 스테이지 클리어</p>
            <h2 id="certificate-title">인증서가 발급되었습니다</h2>
          </div>
          <button className="btn btn-secondary" onClick={onClose}>닫기</button>
        </div>

        <div className="certificate-preview">
          <canvas ref={canvasRef} width="1400" height="990" />
        </div>

        <div className="certificate-actions">
          <div className="certificate-level-summary">
            <strong>{levelInfo.level}단계 · {levelInfo.title}</strong>
            <span>오답과 힌트 합계 {totalPenalty}회 기준</span>
          </div>
          <div className="certificate-action-controls">
            <div className="certificate-set-toggle" aria-label="캐릭터 세트 선택">
              {Object.entries(CHARACTER_SET_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  className={`btn ${characterSet === key ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setCharacterSet(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setCharacterVariant(prev => (prev + 1) % characterVariantCount)}
            >
              캐릭터 바꾸기 ({characterVariant + 1}/{characterVariantCount})
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={characterStatus !== 'ready'}>
              {characterStatus === 'ready' ? '이미지 저장' : '캐릭터 불러오는 중'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
