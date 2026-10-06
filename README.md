# Aires de Patagonia — web

Sitio estático (HTML + CSS + JS). No necesita build ni dependencias: se sube tal cual a cualquier hosting.

## Estructura

```
index.html          página principal con 5 secciones + navegación
tienda.html         tienda online (pedido para recoger por WhatsApp)
css/style.css       estilos, paleta y texturas (todo en :root)
js/main.js          animaciones (la tienda solo usa menú, barra y cartel) (GSAP 3.12 + ScrollTrigger + Observer, por CDN)
assets/img/         logos, fotos del local y fotos de producto (food-*.webp, sin usar de momento)
```

## Ver en local

```bash
python -m http.server 5310
```

Y abrir `http://localhost:5310`.

## Idea de diseño: entrar al salón

La web no decora con "motivos patagónicos" genéricos: **todo sale de las fotos del local**.
Cada elemento de la página es algo que se ve en la sala.

| En el local | En la web |
|---|---|
| Focos de carril del techo | Riel diagonal con conos de luz en el hero; foco cálido que sigue al cursor en las secciones oscuras (`.luzable`) |
| Muro verde con el logo, en marco de madera | Foto principal del hero, en marco de madera barnizada |
| Nichos iluminados con tira LED (botellas) | `.nicho`: marco de las fotos, de cada categoría de la carta y de las tarjetas de local |
| Cartel de madera con el horario | `.cartel`: cuelga del riel del hero y se mece |
| Etiqueta de panadería, tabla de madera | Menú hamburguesa (etiqueta kraft con agujero), barra de nav en madera al hacer scroll, teléfono como tarjeta de papel |
| Poste de señales del "fin del mundo" | Sección Visitanos: tablas indicadoras de madera con las dos direcciones y "Patagonia · 11.000 km" |
| Zócalo y mesas de madera barnizada | Textura `.madera`: franja de origen, marcos de vídeo, balda de la vitrina, footer |
| Suelo de baldosa crema | Fondo de "El salón" y "Cómo trabajamos" |
| Banqueta de cuero capitoné | Fondo de las reseñas (patrón SVG con botones y pliegues) |
| Garabato a rotulador en la caja de vino | Notas a mano (`.nota`, fuente Caveat) |
| Letra gorda y redondeada del cartel de madera | Fraunces con los ejes `SOFT` y `WONK` activados |

Las texturas (madera, yeso, baldosa, cuero) son SVG incrustados en `:root` de `style.css`: no hay imágenes extra.

## Paleta

Muestreada de las fotos.

| Variable | Uso |
|---|---|
| `--pared-950 … 500` | pared petróleo (de la sombra a la zona iluminada) |
| `--led` | tira LED de los nichos |
| `--crema / --papel` | baldosa y papel |
| `--ambar / --ambar-soft` | luz cálida, botones, acentos |
| `--madera / --barniz / --mimbre` | madera barnizada y mimbre |
| `--burdeos` | hojas burdeos de las plantas |

## Tipografías

- **Fraunces** (variable, `SOFT 100` + `WONK 1`): titulares.
- **Karla**: texto.
- **Caveat**: notas a mano.

## Secciones

1. **Hero** — título, oficios, foto del muro verde enmarcada, cóndor del logo.
2. **Zócalo / origen** — franja de madera con las coordenadas del Fitz Roy y de Alicante.
3. **El salón** (sobre nosotros) — fotos en nichos con LED y pies a mano.
4. **La carta** — hoja de papel sobre mesa de madera, con pestañas Dulce / Salado / Para beber y precios reales.
5. **Reseñas** — comandas de cocina (tickets con borde dentado y "TOTAL ★★★★★") colgadas de un riel metálico, sobre la banqueta de cuero.
6. **Visitanos** — dos locales y horario.

## Editar la carta

Transcrita de las fotos de la carta real (precios incluidos). Tres pestañas: Dulce, Salado y Para beber.
Cada plato es un `<li class="carta__item">` con `carta__name`, `carta__dots` y `carta__price`; la descripción
(`carta__desc`) es opcional. Los grupos de sabores sin precio por plato usan `<p class="carta__lista">`.

Ojo: la carta no incluye heladería (no aparece en las fotos). Si hay una carta de helados, falta añadirla.

## SEO

- **Título y descripción** orientados a la búsqueda local ("pastelería argentina en Alicante"), con H1 único que incluye la frase clave.
- **Datos estructurados (JSON-LD)** en `index.html`: `Organization`, dos `Bakery`/`CafeOrCoffeeShop` (uno por local, con dirección, horario y teléfono), `Menu` con los platos y precios (generado a partir de la carta) y `FAQPage`.
- **Sección de preguntas frecuentes** con respuestas basadas solo en datos reales de la carta y del local.
- **NAP** (nombre, dirección, teléfono) de ambos locales visible en el pie de página.
- **Rendimiento**: fotos y logo en WebP con `width`/`height`, `preload` de la imagen principal y scripts con `defer`.
- `robots.txt` incluido.

### Pendiente: dominio

Cuando se conozca la URL final hay que añadir (necesitan URL absoluta): `<link rel="canonical">`, `og:url`,
`og:image` (usar `assets/img/og-cover.jpg`, 1200×630), `twitter:image`, `url` en el JSON-LD y `sitemap.xml`
(con la línea `Sitemap:` en `robots.txt`). También conviene dar de alta la web en Google Search Console y mantener
los datos de las dos fichas de Google Business Profile idénticos a los del pie de página.

## Tienda online (`tienda.html`)

Hecha con los mismos materiales que la web (nichos con LED, madera, papel, etiquetas kraft). Sin servidor ni pasarela de pago:

- Los productos y precios salen de la carta real. Están escritos en el HTML (visibles para buscadores) y con datos estructurados (`ItemList` de `Product` con `Offer`).
- El carrito vive en el navegador (`localStorage`). Al enviar, se abre **WhatsApp** (`js/tienda.js`, constante `WHATSAPP`) con el pedido redactado: productos, total, local, día, hora y nombre. El pago es en el local al recoger.
- Para añadir o cambiar un producto: copiar un bloque `<article class="prod">` (o `.fila`) y ajustar `data-id`, `data-name`, los `data-price` de las opciones y el JSON-LD de la cabecera.
