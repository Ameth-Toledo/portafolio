import React, { useRef, useState } from "react";

function isRTL(text: string) {
  return /[֐-׿؀-ۿ܀-ݏ]/.test(text);
}

export interface InfoCardLinks {
  github?: string;
  npm?: string;
  web?: string;
}

export interface InfoCardProps {
  image: string;
  title: string;
  description: string;
  techs?: string[];
  links?: InfoCardLinks;
  width?: number;
  height?: number;
  borderColor?: string;
  borderBgColor?: string;
  borderWidth?: number;
  borderPadding?: number;
  cardBgColor?: string;
  shadowColor?: string;
  patternColor1?: string;
  patternColor2?: string;
  textColor?: string;
  hoverTextColor?: string;
  fontFamily?: string;
  rtlFontFamily?: string;
  effectBgColor?: string;
  contentPadding?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  image,
  title,
  description,
  techs = [],
  links = {},
  width = 388,
  height = 378,
  borderColor = "var(--ic-border-color)",
  borderBgColor = "var(--ic-border-bg)",
  borderWidth = 3,
  borderPadding = 14,
  cardBgColor = "var(--ic-card-bg)",
  shadowColor = "var(--ic-shadow)",
  patternColor1 = "var(--ic-pattern1)",
  patternColor2 = "var(--ic-pattern2)",
  textColor = "var(--ic-text)",
  hoverTextColor = "var(--ic-hover-text)",
  fontFamily = "'Fira Code', monospace",
  rtlFontFamily = "'Fira Code', monospace",
  effectBgColor = "var(--ic-effect-bg)",
  contentPadding = "10px 16px",
}) => {
  const [hovered, setHovered] = useState(false);
  const borderRef = useRef<HTMLDivElement>(null);

  // Derived inner dimensions so resizing works correctly
  const innerWidth = width - 2 * borderWidth - 2 * borderPadding;
  const innerHeight = height - 2 * borderWidth - 2 * borderPadding;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const border = borderRef.current;
    if (!border) return;
    const rect = border.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x);
    border.style.setProperty("--rotation", `${angle}rad`);
  };

  const rtl = isRTL(title) || isRTL(description);
  const effectiveFont = rtl ? rtlFontFamily : fontFamily;
  const titleDirection = isRTL(title) ? "rtl" : "ltr";
  const descDirection = isRTL(description) ? "rtl" : "ltr";

  const pattern =
    `linear-gradient(45deg, ${patternColor1} 25%, transparent 25%, transparent 75%, ${patternColor2} 75%),` +
    `linear-gradient(-45deg, ${patternColor2} 25%, transparent 25%, transparent 75%, ${patternColor1} 75%)`;

  const borderGradient = `conic-gradient(from var(--rotation,0deg), ${borderColor} 0deg, ${borderColor} 90deg, ${borderBgColor} 90deg, ${borderBgColor} 360deg)`;

  return (
    <div
      ref={borderRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (borderRef.current)
          borderRef.current.style.setProperty("--rotation", "0deg");
      }}
      style={{
        width,
        height,
        border: `${borderWidth}px solid transparent`,
        borderRadius: "1em",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        backgroundImage: `linear-gradient(${cardBgColor}, ${cardBgColor}), ${borderGradient}`,
        padding: borderPadding,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        transition: "box-shadow 0.3s",
        position: "relative",
        fontFamily: effectiveFont,
        boxShadow: hovered ? `0 8px 32px -8px ${shadowColor}` : "none",
      } as React.CSSProperties}
    >
      <div
        style={{
          width: innerWidth,
          height: innerHeight,
          borderRadius: "1em",
          background: cardBgColor,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          backgroundImage: pattern,
          backgroundSize: "20.84px 20.84px",
          padding: "0 0 8px 0",
        }}
      >
        {/* Image — fixed height so content area is consistent */}
        <div style={{ width: "100%", height: Math.floor(innerHeight * 0.55), flexShrink: 0, overflow: "hidden" }}>
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: contentPadding,
            minHeight: 0,
          }}
        >
          <h1
            style={{
              fontSize: 16,
              fontWeight: "bold",
              letterSpacing: "-.01em",
              lineHeight: "normal",
              marginBottom: 3,
              color: hovered ? hoverTextColor : textColor,
              transition: "color 0.3s ease",
              position: "relative",
              overflow: "hidden",
              direction: titleDirection,
              width: "auto",
            }}
          >
            <span
              style={{
                position: "relative",
                zIndex: 10,
                padding: "2px 4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                height: "100%",
              }}
            >
              {title}
            </span>
            <span
              style={{
                clipPath: hovered
                  ? "polygon(0 0, 100% 0, 100% 100%, 0% 100%)"
                  : "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
                transformOrigin: "center",
                transition: "all cubic-bezier(.1,.5,.5,1) 0.4s",
                position: "absolute",
                left: -4,
                right: -4,
                top: -4,
                bottom: -4,
                zIndex: 0,
                backgroundColor: effectBgColor,
              }}
            />
          </h1>
          <p
            style={{
              fontSize: 12,
              color: textColor,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              direction: descDirection,
              marginBottom: 0,
              paddingBottom: 0,
              minHeight: 0,
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>

          {(techs.length > 0 || links.github || links.npm || links.web) && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 8, gap: 6 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                {techs.map((src) => (
                  <img key={src} src={src} alt="" style={{ width: 18, height: 18, objectFit: "contain", flexShrink: 0 }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {[
                  links.github && { href: links.github, icon: "/assets/icons/github.svg", label: "GitHub" },
                  links.npm    && { href: links.npm,    icon: "/assets/icons/npm.svg",    label: "npm"    },
                  links.web    && { href: links.web,    icon: "/assets/icons/web.svg",    label: "Web"    },
                ].filter(Boolean).map((btn: any) => (
                  <a
                    key={btn.label}
                    href={btn.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "2px 8px",
                      borderRadius: 20,
                      border: `1px solid ${textColor}`,
                      fontSize: 10,
                      color: textColor,
                      textDecoration: "none",
                      opacity: 0.65,
                      lineHeight: 1.6,
                      transition: "opacity 0.2s",
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "0.65")}
                  >
                    <img src={btn.icon} alt="" style={{ width: 12, height: 12, objectFit: "contain" }} />
                    {btn.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
