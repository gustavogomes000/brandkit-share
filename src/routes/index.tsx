import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
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
  ShieldCheck,
  Instagram,
  Facebook,
  MessageCircle,
} from "lucide-react";

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
      { property: "og:image", content: "/brand-kit/photos/sarelli-oficial.jpeg" },
    ],
  }),
  component: BrandKit,
});

const COLORS = [
  { name: "Rosa Sarelli", hex: "#E8528A", rgb: "232, 82, 138", role: "Cor primária" },
  { name: "Rosa Claro", hex: "#F8D7E2", rgb: "248, 215, 226", role: "Fundo / suporte" },
  { name: "Dourado", hex: "#C9A24A", rgb: "201, 162, 74", role: "Detalhe / destaque" },
  { name: "Verde Profundo", hex: "#2E4A3D", rgb: "46, 74, 61", role: "Texto principal" },
  { name: "Branco", hex: "#FFFFFF", rgb: "255, 255, 255", role: "Fundo / contraste" },
  { name: "Laranja NOVO", hex: "#F7941D", rgb: "247, 148, 29", role: "Partido NOVO" },
];

const LOGOS = [
  {
    title: "Logo Sarelli — Chama a Doutora",
    desc: "Logo principal da campanha. Use sobre fundos claros.",
    src: "/brand-kit/logos/logo-sarelli.png",
    file: "logo-sarelli.png",
    bg: "bg-white",
  },
  {
    title: "Logo Sarelli — Fundo Rosa",
    desc: "Mesma logo principal aplicada sobre o rosa da campanha.",
    src: "/brand-kit/logos/logo-sarelli.png",
    file: "logo-sarelli.png",
    bg: "bg-[var(--primary)]/10",
  },
  {
    title: "Logo Partido NOVO",
    desc: "Logo do Partido NOVO — usar em parceria institucional.",
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
    desc: "Compromisso com os direitos, saúde e proteção integral das mulheres goianas. Combate à violência, igualdade de oportunidades e empoderamento feminino.",
  },
  {
    icon: Baby,
    title: "Defesa da Criança",
    desc: "Proteção integral da infância e adolescência. Garantia de direitos fundamentais, combate ao abuso e acesso pleno à saúde e educação de qualidade.",
  },
  {
    icon: Home,
    title: "Famílias em Vulnerabilidade",
    desc: "Políticas públicas efetivas de assistência social, geração de emprego e renda, moradia digna e apoio integral às famílias em situação de risco.",
  },
];

const DRIVE_FOLDER =
  "https://drive.google.com/drive/folders/1JoPDUH3ueUZ8EK0FvU2K6Lw6AZmWQQnm";

function BrandKit() {
  const [copied, setCopied] = useState<string | null>(null);
  const [zipping, setZipping] = useState(false);

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
      const photo = await fetch("/brand-kit/photos/sarelli-oficial.jpeg");
      photosFolder!.file("sarelli-oficial.jpeg", await photo.blob());

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
        `BRAND KIT — DRA. FERNANDA SARELLI\nPré-candidata a Deputada Estadual por Goiás — Partido NOVO\n\nEste pacote contém:\n- /logos: variações da logo Sarelli e do Partido NOVO\n- /fotos: foto oficial da candidata\n- PALETA-DE-CORES.txt: cores e fontes oficiais\n\nMais fotos em alta no Drive:\n${DRIVE_FOLDER}\n\nUso:\n✅ Use sempre os arquivos originais\n✅ Mantenha respiro ao redor do logo\n❌ Não distorça nem mude as cores\n❌ Não recorte ou modifique a logo\n`
      );

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "brand-kit-sarelli.zip");
      toast.success("Pacote baixado com sucesso!");
    } catch (e) {
      toast.error("Erro ao gerar o pacote. Tente novamente.");
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-center" richColors />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="font-bold tracking-tight">
            <span className="text-primary">Sarelli</span>
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              Brand Kit
            </span>
          </a>
          <div className="hidden gap-6 text-sm font-medium md:flex">
            <a href="#logos" className="hover:text-primary">Logos</a>
            <a href="#cores" className="hover:text-primary">Cores</a>
            <a href="#fontes" className="hover:text-primary">Fontes</a>
            <a href="#fotos" className="hover:text-primary">Fotos</a>
            <a href="#bandeiras" className="hover:text-primary">Bandeiras</a>
            <a href="#regras" className="hover:text-primary">Regras</a>
          </div>
          <Button
            size="sm"
            onClick={downloadAll}
            disabled={zipping}
            className="rounded-full"
          >
            <Download className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">{zipping ? "Gerando..." : "Baixar tudo"}</span>
            <span className="sm:hidden">ZIP</span>
          </Button>
        </nav>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Material Oficial — 2026
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Brand Kit
              <br />
              <span className="text-primary">Dra. Fernanda Sarelli</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">
              Identidade visual completa da campanha pronta para editores,
              criadores e parceiros. Logos, cores, fontes e fotos oficiais —
              tudo em um lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={downloadAll}
                disabled={zipping}
                className="rounded-full shadow-lg"
                style={{ boxShadow: "var(--shadow-elegant)" }}
              >
                <Download className="mr-2 h-5 w-5" />
                {zipping ? "Gerando pacote..." : "Baixar pacote (.zip)"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full"
              >
                <a href="#logos">Ver materiais</a>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto">
            <div
              className="absolute -inset-4 rounded-full blur-3xl opacity-50"
              style={{ background: "var(--gradient-primary)" }}
            />
            <img
              src="/brand-kit/photos/sarelli-oficial.jpeg"
              alt="Dra. Fernanda Sarelli"
              className="relative h-72 w-72 rounded-full border-8 border-primary object-cover shadow-2xl md:h-96 md:w-96"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-bold tracking-wider text-primary shadow-lg">
              CHAMA A DOUTORA
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS */}
      <Section
        id="logos"
        icon={<ImageIcon className="h-5 w-5" />}
        eyebrow="01"
        title="Logos"
        description="Variações oficiais da marca. Clique em baixar para salvar o arquivo PNG."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOGOS.map((l) => (
            <div
              key={l.title + l.bg}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className={`flex h-48 items-center justify-center p-8 ${l.bg}`}>
                <img src={l.src} alt={l.title} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold">{l.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{l.desc}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full rounded-full"
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
        icon={<Palette className="h-5 w-5" />}
        eyebrow="02"
        title="Paleta de Cores"
        description="Cores oficiais da campanha. Clique no código HEX para copiar."
        alt
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COLORS.map((c) => (
            <button
              key={c.hex}
              onClick={() => copyHex(c.hex)}
              className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className="relative h-32 w-full"
                style={{ backgroundColor: c.hex }}
              >
                <div className="absolute right-3 top-3 rounded-full bg-black/30 p-2 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  {copied === c.hex ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold">{c.name}</h3>
                  <span className="text-xs text-muted-foreground">{c.role}</span>
                </div>
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
        icon={<Type className="h-5 w-5" />}
        eyebrow="03"
        title="Tipografia"
        description="Fontes utilizadas na comunicação oficial. Disponíveis gratuitamente no Google Fonts."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {FONTS.map((f) => (
            <div
              key={f.name}
              className="overflow-hidden rounded-2xl border border-border bg-card p-8"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="text-8xl font-extrabold leading-none text-primary">
                {f.sample}
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <h3 className="text-xl font-bold">{f.name}</h3>
                  <p className="text-sm text-muted-foreground">{f.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Pesos: {f.weight}</p>
                </div>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <a href={f.url} target="_blank" rel="noreferrer">
                    <Download className="mr-2 h-4 w-4" /> Google Fonts
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
        icon={<ImageIcon className="h-5 w-5" />}
        eyebrow="04"
        title="Fotos Oficiais"
        description="Acervo de fotos em alta resolução para uso em peças e redes sociais."
        alt
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div
            className="overflow-hidden rounded-2xl border border-border bg-card"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <img
              src="/brand-kit/photos/sarelli-oficial.jpeg"
              alt="Dra. Fernanda Sarelli"
              className="h-80 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="font-semibold">Foto Oficial</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Retrato oficial da candidata em alta resolução.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4 w-full rounded-full"
                onClick={() =>
                  downloadFile("/brand-kit/photos/sarelli-oficial.jpeg", "sarelli-oficial.jpeg")
                }
              >
                <Download className="mr-2 h-4 w-4" /> Baixar foto
              </Button>
            </div>
          </div>
          <div
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 p-10 text-center"
          >
            <div className="rounded-full bg-primary/10 p-4">
              <ImageIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-bold">Acervo completo no Drive</h3>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              Acesse a pasta oficial com todas as fotos em alta resolução
              disponíveis para download.
            </p>
            <Button asChild className="mt-5 rounded-full">
              <a href={DRIVE_FOLDER} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Abrir pasta no Drive
              </a>
            </Button>
          </div>
        </div>
      </Section>

      {/* BANDEIRAS */}
      <Section
        id="bandeiras"
        icon={<Heart className="h-5 w-5" />}
        eyebrow="05"
        title="Nossas Bandeiras"
        description="Pilares fundamentais que guiam nossa atuação. Use estes textos em legendas e materiais."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {BANDEIRAS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ boxShadow: "var(--shadow-soft)" }}
            >
              <div className="inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* REGRAS */}
      <Section
        id="regras"
        icon={<ShieldCheck className="h-5 w-5" />}
        eyebrow="06"
        title="Como Usar"
        description="Diretrizes rápidas para preservar a identidade visual da campanha."
        alt
      >
        <div className="grid gap-6 md:grid-cols-2">
          <RuleCard
            title="✅ Pode"
            color="text-emerald-700"
            items={[
              "Usar os logos sempre em alta resolução",
              "Manter área de respiro ao redor do logo",
              "Combinar rosa primário com fundos claros",
              "Usar dourado como detalhe de destaque",
              "Aplicar fontes Montserrat (títulos) e Inter (texto)",
            ]}
          />
          <RuleCard
            title="❌ Não pode"
            color="text-rose-700"
            items={[
              "Distorcer, esticar ou recortar o logo",
              "Trocar as cores oficiais da marca",
              "Aplicar logo sobre fundos conflitantes",
              "Usar fotos com filtros que alterem a cor",
              "Misturar com outras identidades partidárias",
            ]}
          />
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex flex-col items-center gap-6 text-center">
            <div>
              <h3 className="text-2xl font-extrabold text-primary">
                Dra. Fernanda Sarelli
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Pré-candidata a Deputada Estadual por Goiás — Partido NOVO
              </p>
            </div>
            <div className="flex gap-3">
              <SocialBtn
                href="https://wa.me/5562993237397?text=Ol%C3%A1%20Dra.%20Fernanda%20Sarelli"
                icon={<MessageCircle className="h-5 w-5" />}
              />
              <SocialBtn
                href="https://www.instagram.com/dra.fernandasarelli"
                icon={<Instagram className="h-5 w-5" />}
              />
              <SocialBtn
                href="https://www.facebook.com/dra.fernandasarelli"
                icon={<Facebook className="h-5 w-5" />}
              />
            </div>
            <Button
              onClick={downloadAll}
              disabled={zipping}
              className="rounded-full"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              {zipping ? "Gerando..." : "Baixar pacote completo"}
            </Button>
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
  title,
  description,
  children,
  alt,
}: {
  id: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 px-4 py-20 ${alt ? "bg-secondary/40" : ""}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            {icon}
            <span>{eyebrow}</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
          <p className="max-w-xl text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function RuleCard({
  title,
  color,
  items,
}: {
  title: string;
  color: string;
  items: string[];
}) {
  return (
    <div
      className="rounded-2xl border border-border bg-card p-6"
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      <h3 className={`text-xl font-bold ${color}`}>{title}</h3>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i} className="text-sm text-muted-foreground">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialBtn({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
    >
      {icon}
    </a>
  );
}
