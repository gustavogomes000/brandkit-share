# Brand Kit — Dra. Fernanda Sarelli

Site público (link aberto) com toda a identidade visual da campanha pronta para editores e criadores de conteúdo baixarem. Inspirado no visual do site oficial (rosa + dourado, logo Sarelli "Chama a Doutora").

## Estrutura do site (página única, com âncoras)

```text
[ Hero ]
  Foto da candidata + nome + slogan
  Botões: "Baixar tudo (.zip)"  |  "Ver materiais"

[ 1. Logos ]           — variações Sarelli + parceria com NOVO
[ 2. Cores ]           — paleta oficial com HEX/RGB (clique p/ copiar)
[ 3. Tipografia ]      — fontes usadas + download
[ 4. Fotos oficiais ]  — galeria do Google Drive
[ 5. Bandeiras ]       — Mulher, Criança, Famílias, etc.
[ 6. Como usar ]       — regras rápidas: o que pode/não pode
[ Rodapé ]             — contatos + redes sociais
```

## O que cada seção entrega

**1. Logos** — cards com preview e botão "Baixar PNG / SVG":
- Logo Sarelli completo (fundo claro)
- Logo Sarelli (fundo escuro / versão branca)
- Logo Sarelli + NOVO (parceria)
- Logo NOVO isolado
- Símbolo / ícone reduzido

**2. Cores** — paleta extraída do site oficial: rosa principal, rosa claro de fundo, dourado do detalhe, verde escuro do texto, branco. Cada cor mostra HEX e RGB com clique-para-copiar e toast de confirmação.

**3. Tipografia** — fontes identificadas no site (sans-serif moderna para títulos + corpo). Mostrar amostra "Aa", nome, peso e botão de download (arquivos .ttf/.woff incluídos no projeto).

**4. Fotos oficiais** — galeria conectada à pasta do Google Drive enviada (`drive.google.com/drive/folders/1JoPDUH3...`). Miniaturas com lightbox e botão "Baixar foto" individual + "Abrir pasta no Drive".

**5. Bandeiras** — cards das pautas: Defesa da Mulher, Defesa da Criança, Famílias em Vulnerabilidade (mesmas do site oficial), com descrição curta para os editores usarem nas legendas.

**6. Como usar** — diretrizes rápidas em formato de checklist:
- ✅ Sempre usar logo em alta resolução
- ✅ Manter área de respiro ao redor do logo
- ❌ Não distorcer / não trocar cores
- ❌ Não usar fundo conflitante com o rosa

**Botão global "Baixar tudo (.zip)"** — gera um pacote com logos + fontes + paleta (PDF de uma página) + link da pasta de fotos.

## Visual

- Mesma linguagem do site oficial: fundo rosa claro, detalhes em rosa vibrante e dourado, tipografia limpa
- Layout responsivo (mobile-first) — editores vão acessar muito pelo celular
- Animações sutis ao rolar
- Header fixo com navegação por âncora entre as seções

## Detalhes técnicos

- Página única (`src/routes/index.tsx`) com seções ancoradas, já que é um material consultivo de leitura linear
- Assets (logos, fontes, ícones) versionados em `public/brand-kit/` para download direto
- Geração do `.zip` no cliente com `jszip` (sem necessidade de backend)
- Galeria de fotos: como o Google Drive não permite hotlink confiável de imagens públicas via API sem OAuth, vou exibir os thumbnails que você me passar (ou que eu extrair do Drive público) e manter o botão "Abrir pasta completa no Drive" para o download em massa direto no Drive
- Sem login, sem banco — site 100% estático e rápido

## O que preciso de você depois (opcional, para deixar 100%)

1. Arquivos originais dos logos (SVG/PNG transparente) — sem isso, vou usar as versões PNG do site oficial
2. Arquivos das fontes (.ttf/.otf) se forem fontes pagas; se forem do Google Fonts, eu já resolvo
3. Confirmar se posso listar as fotos do Drive uma a uma ou se basta o link da pasta

Posso começar com o que já tenho e você complementa depois.
