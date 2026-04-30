import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import JSZip from "jszip";
import fileSaver from "file-saver";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Heart,
  Baby,
  Home,
  Type,
  Palette,
  Image as ImageIcon,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const { saveAs } = fileSaver;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brand Kit — Dra. Fernanda Sarelli | Identidade Visual Oficial" },
      {
        name: "description",
        content:
          "Material oficial de identidade visual da Dra. Fernanda Sarelli. Logos, cores, fontes e fotos para download — uso por editores e parceiros.",
      },
      { property: "og:title", content: "Brand Kit — Dra. Fernanda Sarelli" },
      {
        property: "og:description",
        content:
          "Tudo o que você precisa para criar conteúdo: logos, cores, fontes e fotos oficiais.",
      },
      { property: "og:image", content: "/brand-kit/photos/sarelli-oficial.jpg" },
    ],
  }),
  component: BrandKit,
});

const COLORS = [
  { name: "Rosa Sarelli", hex: "#E8528A", rgb: "232, 82, 138", role: "Primária" },
  { name: "Rosa Claro", hex: "#F8D7E2", rgb: "248, 215, 226", role: "Fundo" },
  { name: "Dourado", hex: "#C9A24A", rgb: "201, 162, 74", role: "Detalhe" },
  { name: "Verde Profundo", hex: "#2E4A3D", rgb: "46, 74, 61", role: "Texto" },
  { name: "Branco", hex: "#FFFFFF", rgb: "255, 255, 255", role: "Contraste" },
  { name: "Laranja NOVO", hex: "#F7941D", rgb: "247, 148, 29", role: "Partido" },
];

const LOGOS = [
  {
    title: "Logo Sarelli — Oficial",
    desc: "Logo principal — fundo claro.",
    src: "/brand-kit/logos/logo-sarelli.png",
    file: "logo-sarelli.png",
    bg: "bg-white",
  },
  {
    title: "Logo Sarelli — Rosa",
    desc: "Aplicação sobre o rosa da campanha.",
    src: "/brand-kit/logos/logo-sarelli.png",
    file: "logo-sarelli-rosa.png",
    bg: "",
    bgStyle: { background: "var(--gradient-hero)" },
  },
  {
    title: "Logo Partido NOVO",
    desc: "Para parceria institucional.",
    src: "/brand-kit/logos/logo-novo.png",
    file: "logo-novo.png",
    bg: "bg-white",
  },
];

const FONTS = [
  {
    name: "Montserrat",
    role: "Títulos e destaques",
    sample: "Aa",
    weight: "700 / 800",
    url: "https://fonts.google.com/specimen/Montserrat",
  },
  {
    name: "Inter",
    role: "Texto corrido",
    sample: "Aa",
    weight: "400 / 500",
    url: "https://fonts.google.com/specimen/Inter",
  },
];

const BANDEIRAS = [
  {
    icon: Heart,
    title: "Defesa da Mulher",
    desc: "Direitos, saúde e proteção integral. Combate à violência, igualdade de oportunidades e empoderamento feminino.",
  },
  {
    icon: Baby,
    title: "Defesa da Criança",
    desc: "Proteção da infância e adolescência. Combate ao abuso e acesso pleno à saúde e educação de qualidade.",
  },
  {
    icon: Home,
    title: "Famílias em Vulnerabilidade",
    desc: "Assistência social, geração de renda, moradia digna e apoio integral às famílias em situação de risco.",
  },
];

const DRIVE_FOLDER =
  "https://drive.google.com/drive/folders/1JoPDUH3ueUZ8EK0FvU2K6Lw6AZmWQQnm";

const CHAPTERS = [
  { id: "logos", label: "Logos" },
  { id: "cores", label: "Cores" },
  { id: "fontes", label: "Fontes" },
  { id: "fotos", label: "Fotos" },
  { id: "bandeiras", label: "Bandeiras" },
];

function BrandKit() {
  const [copied, setCopied] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);

  // Track active chapter on scroll
  useEffect(() => {
    const onScroll = () => {
      const offsets = CHAPTERS.map((c) => {
        const el = document.getElementById(c.id);
        return el ? el.getBoundingClientRect().top : Infinity;
      });
      const idx = offsets.findIndex((o) => o > 120);
      const current = idx === -1 ? CHAPTERS.length - 1 : Math.max(0, idx - 1);
      setActiveChapter(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyHex = async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopied(hex);
    toast.success(`${hex} copiado!`);
    setTimeout(() => setCopied(null), 1500);
  };

  const downloadFile = async (url: string, filename: string) => {
    const r = await fetch(url);
    const blob = await r.blob();
    saveAs(blob, filename);
  };

  const downloadAll = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      const logosFolder = zip.folder("logos");
      const photosFolder = zip.folder("fotos");

      for (const l of LOGOS) {
        const r = await fetch(l.src);
        logosFolder!.file(l.file, await r.blob());
      }
      const photo = await fetch("/brand-kit/photos/sarelli-oficial.jpg");
      photosFolder!.file("sarelli-foto-do-site.jpg", await photo.blob());

      const palette = COLORS.map(
        (c) => `${c.name} — ${c.hex} — RGB(${c.rgb}) — ${c.role}`
      ).join("\n");
      zip.file(
        "PALETA-DE-CORES.txt",
        `IDENTIDADE VISUAL — DRA. FERNANDA SARELLI\n\n=== PALETA OFICIAL ===\n\n${palette}\n\n=== TIPOGRAFIA ===\n\n${FONTS.map(
          (f) => `${f.name} — ${f.role} — ${f.url}`
        ).join("\n")}\n\n=== FOTOS ADICIONAIS ===\n${DRIVE_FOLDER}\n`
      );
      zip.file(
        "LEIA-ME.txt",
        `BRAND KIT — DRA. FERNANDA SARELLI\nPré-candidata a Deputada Estadual por Goiás — Partido NOVO\n\nEste pacote contém:\n- /logos: variações da logo Sarelli e do Partido NOVO\n- /fotos: foto oficial usada no site\n- PALETA-DE-CORES.txt: cores e fontes oficiais\n\nMais fotos em alta no Drive:\n${DRIVE_FOLDER}\n`
      );

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "brand-kit-sarelli.zip");
      toast.success("Pacote baixado com sucesso!");
    } catch {
      toast.error("Erro ao gerar o pacote. Tente novamente.");
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Toaster position="top-center" richColors />

      {/* HEADER — estilo deck */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <a href="#top" className="flex items-center gap-3 shrink-0">
            <img
              src="/brand-kit/logos/logo-sarelli.png"
              alt="Sarelli"
              className="h-9 w-auto"
            />
            <span className="hidden h-6 w-px bg-border md:block" />
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground md:inline">
              Brand Kit
            </span>
          </a>

          {/* Chapter tabs — like the original deck */}
          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {CHAPTERS.map((c, i) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className={`group flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  activeChapter === i
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <span className="font-mono opacity-60">
                  0{i + 1}
                </span>
                {c.label}
              </a>
            ))}
          </div>

          {/* Chapter counter — like the original */}
          <div className="hidden items-center gap-3 rounded-full border border-border bg-card px-4 py-1.5 md:flex">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Cap.
            </span>
            <span className="font-mono text-sm font-bold text-primary">
              {String(activeChapter + 1).padStart(2, "0")}
            </span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="font-mono text-sm text-muted-foreground">
              {String(CHAPTERS.length).padStart(2, "0")}
            </span>
          </div>

          <Button
            size="sm"
            onClick={downloadAll}
            disabled={zipping}
            className="rounded-full font-semibold shadow-md"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <Download className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">{zipping ? "Gerando..." : "Baixar tudo"}</span>
            <span className="sm:hidden">ZIP</span>
          </Button>
        </nav>
      </header>

      {/* HERO — formato deck/apresentação */}
      <section
        id="top"
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* decorative dots */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* gold curve decoration */}
        <svg
          className="pointer-events-none absolute -bottom-2 left-0 right-0 w-full"
          viewBox="0 0 1200 80"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 Q 300 0, 600 40 T 1200 40"
            stroke="var(--gold)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M0 60 Q 300 20, 600 60 T 1200 60"
            stroke="var(--gold)"
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
          />
        </svg>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-[1.1fr_1fr] md:py-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Pré-candidata · Deputada Estadual GO · NOVO
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-foreground md:text-7xl lg:text-8xl">
              Brand
              <br />
              <span className="italic text-primary">Kit.</span>
            </h1>

            <div className="mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-primary to-[var(--gold)]" />

            <p className="mt-6 max-w-md text-base leading-relaxed text-foreground/75 md:text-lg">
              Identidade visual completa da campanha pronta para editores,
              criadores e parceiros. <strong>Logos, cores, fontes e fotos
              oficiais</strong> — tudo em um lugar.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={downloadAll}
                disabled={zipping}
                className="rounded-full px-7 font-semibold"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <Download className="mr-2 h-5 w-5" />
                {zipping ? "Gerando pacote..." : "Baixar pacote (.zip)"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full border-foreground/20 bg-white/60 px-7 font-semibold backdrop-blur hover:bg-white"
              >
                <a href="#logos">
                  Ver materiais
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* meta info row — like original */}
            <div className="mt-12 flex items-center gap-8">
              <div>
                <p className="text-3xl font-black text-foreground">GO</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Estado
                </p>
              </div>
              <div className="h-10 w-px bg-foreground/15" />
              <div>
                <p className="text-3xl font-black text-foreground">2026</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                  Eleições
                </p>
              </div>
              <div className="h-10 w-px bg-foreground/15" />
              <div className="flex gap-2">
                <SocialBtn
                  href="https://www.instagram.com/drafernandasarelli/"
                  icon={<Instagram className="h-4 w-4" />}
                  small
                />
                <SocialBtn
                  href="https://www.facebook.com/people/Dra-Fernanda-Sarelli/61554974150545/"
                  icon={<Facebook className="h-4 w-4" />}
                  small
                />
              </div>
            </div>
          </div>

          {/* Portrait + logo stack */}
          <div className="relative mx-auto flex flex-col items-center gap-6">
            <div className="relative">
              <div
                className="absolute -inset-6 rounded-full opacity-50 blur-3xl"
                style={{ background: "var(--gradient-primary)" }}
              />
              <div
                className="relative rounded-full p-1.5"
                style={{ background: "var(--gradient-primary)" }}
              >
                <img
                  src="/brand-kit/photos/sarelli-oficial.jpg"
                  alt="Dra. Fernanda Sarelli"
                  className="h-72 w-72 rounded-full border-4 border-white object-cover shadow-2xl md:h-96 md:w-96"
                />
              </div>
            </div>
            <img
              src="/brand-kit/logos/logo-sarelli.png"
              alt="Sarelli — Chama a Doutora"
              className="h-20 w-auto md:h-24 drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <Section
        id="logos"
        eyebrow="01"
        kicker="Identidade"
        icon={<ImageIcon className="h-4 w-4" />}
        title="Logos"
        description="Variações oficiais da marca. Clique em baixar para salvar o arquivo."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOGOS.map((l) => (
            <div
              key={l.title}
              className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1.5 hover:shadow-2xl"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div
                className={`flex h-52 items-center justify-center p-10 ${l.bg}`}
                style={l.bgStyle}
              >
                <img
                  src={l.src}
                  alt={l.title}
                  className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="border-t border-border p-5">
                <h3 className="font-bold tracking-tight">{l.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{l.desc}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full rounded-full font-semibold"
                  onClick={() => downloadFile(l.src, l.file)}
                >
                  <Download className="mr-2 h-4 w-4" /> Baixar PNG
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CORES */}
      <Section
        id="cores"
        eyebrow="02"
        kicker="Sistema"
        icon={<Palette className="h-4 w-4" />}
        title="Paleta de Cores"
        description="Cores oficiais da campanha. Clique no código HEX para copiar."
        alt
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => copyHex(c.hex)}
              className="group overflow-hidden rounded-3xl border border-border bg-card text-left transition-all hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div
                className="relative h-36 w-full"
                style={{ backgroundColor: c.hex }}
              >
                <div className="absolute right-3 top-3 rounded-full bg-black/30 p-2 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  {copied === c.hex ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </div>
                <div className="absolute bottom-3 left-3 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  {c.role}
                </div>
              </div>
              <div className="border-t border-border p-4">
                <h3 className="font-bold tracking-tight">{c.name}</h3>
                <p className="mt-2 font-mono text-sm font-bold text-primary">{c.hex}</p>
                <p className="text-xs text-muted-foreground">RGB({c.rgb})</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* FONTES */}
      <Section
        id="fontes"
        eyebrow="03"
        kicker="Tipografia"
        icon={<Type className="h-4 w-4" />}
        title="Fontes Oficiais"
        description="Fontes utilizadas na comunicação. Disponíveis gratuitamente no Google Fonts."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {FONTS.map((f) => (
            <div
              key={f.name}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 transition-all hover:-translate-y-1.5 hover:shadow-2xl"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div
                className="absolute right-6 top-6 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground"
              >
                {f.weight}
              </div>
              <div
                className="text-[10rem] font-extrabold leading-[0.85] tracking-tight"
                style={{
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {f.sample}
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{f.name}</h3>
                  <p className="text-sm text-muted-foreground">{f.role}</p>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-full font-semibold">
                  <a href={f.url} target="_blank" rel="noreferrer">
                    Google Fonts
                    <ExternalLink className="ml-2 h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* FOTOS */}
      <Section
        id="fotos"
        eyebrow="04"
        kicker="Acervo"
        icon={<ImageIcon className="h-4 w-4" />}
        title="Fotos Oficiais"
        description="Foto utilizada no site oficial e acervo completo no Drive."
        alt
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-1.5 hover:shadow-2xl"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="relative h-96 overflow-hidden">
              <img
                src="/brand-kit/photos/sarelli-oficial.jpg"
                alt="Dra. Fernanda Sarelli"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                Oficial
              </div>
            </div>
            <div className="border-t border-border p-5">
              <h3 className="font-bold tracking-tight">Foto do Site</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Retrato utilizado no site oficial — alta resolução.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 w-full rounded-full font-semibold"
                onClick={() =>
                  downloadFile(
                    "/brand-kit/photos/sarelli-oficial.jpg",
                    "sarelli-foto-do-site.jpg"
                  )
                }
              >
                <Download className="mr-2 h-4 w-4" /> Baixar foto
              </Button>
            </div>
          </div>

          <a
            href={DRIVE_FOLDER}
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-[var(--gold)]/5 p-10 text-center transition-all hover:-translate-y-1.5 hover:border-primary hover:shadow-2xl"
          >
            <div
              className="absolute inset-0 opacity-[0.05] transition-opacity group-hover:opacity-[0.1]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div
              className="relative rounded-2xl p-5 shadow-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h3 className="relative mt-6 text-xl font-bold tracking-tight">
              Acervo completo no Drive
            </h3>
            <p className="relative mt-2 max-w-xs text-sm text-muted-foreground">
              Pasta oficial com todas as fotos em alta resolução.
            </p>
            <div className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg">
              Abrir pasta no Drive
              <ExternalLink className="h-4 w-4" />
            </div>
          </a>
        </div>
      </Section>

      {/* BANDEIRAS */}
      <Section
        id="bandeiras"
        eyebrow="05"
        kicker="Pautas"
        icon={<Heart className="h-4 w-4" />}
        title="Nossas Bandeiras"
        description="Pilares fundamentais que guiam nossa atuação. Use estes textos em legendas e materiais."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {BANDEIRAS.map((b, i) => (
            <div
              key={b.title}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1.5 hover:shadow-2xl"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="absolute right-5 top-5 font-mono text-xs font-bold text-muted-foreground/50">
                0{i + 1}
              </div>
              <div
                className="inline-flex rounded-2xl p-3.5 text-white shadow-lg"
                style={{ background: "var(--gradient-primary)" }}
              >
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold tracking-tight">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FOOTER */}
      <footer
        className="relative overflow-hidden border-t border-border"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-col items-center gap-6 text-center">
            <img
              src="/brand-kit/logos/logo-sarelli.png"
              alt="Dra. Fernanda Sarelli"
              className="h-20 w-auto drop-shadow-lg"
            />
            <p className="max-w-md text-sm text-muted-foreground">
              Pré-candidata a Deputada Estadual por Goiás — Partido NOVO
            </p>
            <div className="flex gap-3">
              <SocialBtn
                href="https://wa.me/5562993237397?text=Ol%C3%A1%20Dra.%20Fernanda%20Sarelli"
                icon={<MessageCircle className="h-5 w-5" />}
              />
              <SocialBtn
                href="https://www.instagram.com/drafernandasarelli/"
                icon={<Instagram className="h-5 w-5" />}
              />
              <SocialBtn
                href="https://www.facebook.com/people/Dra-Fernanda-Sarelli/61554974150545/"
                icon={<Facebook className="h-5 w-5" />}
              />
            </div>
            <Button
              onClick={downloadAll}
              disabled={zipping}
              className="rounded-full px-7 font-semibold"
              size="lg"
              style={{ boxShadow: "var(--shadow-elegant)" }}
            >
              <Download className="mr-2 h-5 w-5" />
              {zipping ? "Gerando..." : "Baixar pacote completo"}
            </Button>
            <div className="mt-6 h-px w-24 bg-foreground/15" />
            <p className="text-xs text-muted-foreground">
              © 2026 — Material oficial de campanha
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  icon,
  eyebrow,
  kicker,
  title,
  description,
  children,
  alt,
}: {
  id: string;
  icon: React.ReactNode;
  eyebrow: string;
  kicker: string;
  title: string;
  description: string;
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 px-6 py-24 ${alt ? "bg-secondary/40" : ""}`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-primary">
              {eyebrow}
            </span>
            <div className="h-px w-10 bg-primary/40" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
              {icon}
              {kicker}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight md:text-5xl">
            {title}
          </h2>
          <p className="max-w-xl text-base text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </section>
  );
}

function SocialBtn({
  href,
  icon,
  small,
}: {
  href: string;
  icon: React.ReactNode;
  small?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center rounded-full border border-primary/20 bg-white/70 text-primary backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-lg ${
        small ? "h-9 w-9" : "h-11 w-11"
      }`}
    >
      {icon}
    </a>
  );
}
