import { useEffect, useRef } from 'react';
import { getCertificateLevel } from '../data/certificateLevels';

const UPLOAD_URL = 'https://samboard.vivasam.com/studentEntry/?brdId=brd-0QN1PMGJ84W3T';
const CHARACTER_SHEET_URL = '/certificate-characters.png';

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

function drawCharacter(ctx, levelInfo, x, y) {
  const [mainColor, softColor] = levelInfo.colors;

  ctx.save();
  ctx.translate(x, y);

  const glow = ctx.createRadialGradient(0, 20, 20, 0, 20, 185);
  glow.addColorStop(0, softColor);
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 20, 185, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = mainColor;
  drawRoundedRect(ctx, -74, 30, 148, 142, 48);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, -18, 86, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = mainColor;
  ctx.lineWidth = 8;
  ctx.stroke();

  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.arc(-28, -28, 8, 0, Math.PI * 2);
  ctx.arc(28, -28, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#1f2937';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, -8, 34, 0.18 * Math.PI, 0.82 * Math.PI);
  ctx.stroke();

  ctx.fillStyle = softColor;
  ctx.beginPath();
  ctx.arc(-48, -2, 14, 0, Math.PI * 2);
  ctx.arc(48, -2, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = mainColor;
  ctx.lineWidth = 6;
  drawRoundedRect(ctx, -58, 76, 116, 62, 20);
  ctx.fill();
  ctx.stroke();
  drawText(ctx, levelInfo.formula, 0, 108, 96, 'bold 30px Arial', '#111827');

  ctx.strokeStyle = mainColor;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-74, 72);
  ctx.lineTo(-126, 32);
  ctx.moveTo(74, 72);
  ctx.lineTo(126, 32);
  ctx.stroke();

  if (levelInfo.accessory === 'crown') {
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-54, -88);
    ctx.lineTo(-30, -128);
    ctx.lineTo(0, -88);
    ctx.lineTo(30, -128);
    ctx.lineTo(54, -88);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (levelInfo.accessory === 'ruler') {
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 4;
    drawRoundedRect(ctx, -134, 18, 96, 24, 6);
    ctx.fill();
    ctx.stroke();
  } else if (levelInfo.accessory === 'compass') {
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, -18, 124, -0.2, 1.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(104, 44);
    ctx.lineTo(120, 28);
    ctx.lineTo(122, 52);
    ctx.stroke();
  } else if (levelInfo.accessory === 'mirror') {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(0, -128);
    ctx.lineTo(0, 40);
    ctx.stroke();
    ctx.setLineDash([]);
  } else if (levelInfo.accessory === 'cube') {
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 5;
    ctx.strokeRect(86, -120, 56, 56);
    ctx.strokeRect(110, -96, 56, 56);
    ctx.beginPath();
    ctx.moveTo(142, -120);
    ctx.lineTo(166, -96);
    ctx.moveTo(86, -64);
    ctx.lineTo(110, -40);
    ctx.stroke();
  } else {
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.arc(0, -112, 18 + levelInfo.level, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawGeneratedCharacter(ctx, image, levelInfo, x, y) {
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
  ctx.arc(x, y, 205, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, x - 205, y - 205, 410, 410);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = levelInfo.colors[0];
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(x, y, 206, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  return true;
}

function drawCertificate(canvas, stats, characterSheet = null) {
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

  drawText(ctx, '도형 이동 학습 인증서', width / 2, 170, 900, 'bold 72px Arial', '#111827');
  drawText(ctx, '모든 회전과 뒤집기 스테이지를 끝까지 해결했습니다.', width / 2, 245, 920, '32px Arial', '#475569');

  const usedGeneratedCharacter = drawGeneratedCharacter(ctx, characterSheet, levelInfo, width / 2, 445);
  if (!usedGeneratedCharacter) {
    drawCharacter(ctx, levelInfo, width / 2, 455);
  }

  drawText(ctx, `${levelInfo.level}단계 · ${levelInfo.title}`, width / 2, 690, 900, 'bold 58px Arial', levelInfo.colors[0]);
  drawText(ctx, levelInfo.subtitle, width / 2, 755, 900, 'bold 42px Arial', '#111827');
  drawText(ctx, `누적 오답 ${stats?.wrongAttempts || 0}회 · 힌트 ${stats?.hintUses || 0}회 · 총 페널티 ${totalPenalty}회`, width / 2, 820, 900, '28px Arial', '#64748b');

  const issuedAt = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  drawText(ctx, issuedAt, width / 2, 890, 900, '26px Arial', '#475569');
}

export default function CertificateModal({ open, onClose, stats }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!open || !canvasRef.current) return;
    let cancelled = false;
    const canvas = canvasRef.current;
    drawCertificate(canvas, stats);

    const image = new Image();
    image.onload = () => {
      if (!cancelled) {
        drawCertificate(canvas, stats, image);
      }
    };
    image.onerror = () => {
      if (!cancelled) {
        drawCertificate(canvas, stats);
      }
    };
    image.src = CHARACTER_SHEET_URL;

    return () => {
      cancelled = true;
    };
  }, [open, stats]);

  if (!open) return null;

  const totalPenalty = (stats?.wrongAttempts || 0) + (stats?.hintUses || 0);
  const levelInfo = getCertificateLevel(totalPenalty);

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `makeshape-certificate-level-${levelInfo.level}.png`;
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
          <button className="btn btn-primary" onClick={handleSave}>
            이미지 저장
          </button>
        </div>
      </div>
    </div>
  );
}
