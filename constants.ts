import { Gender, OutfitOption, BackgroundColor } from './types';

export const DAILY_GENERATION_LIMIT = 10;

export const GLOBAL_NEGATIVE_PROMPT = "no hats (unless religious), no sunglasses, no heavy makeup, no teeth-showing smile, no large logos, no busy backgrounds, no props, no shadows across face, no accessories covering face, no reflective glasses, no uniform of government/military/police.";

export const OUTFIT_OPTIONS: OutfitOption[] = [
  // --- MALE OUTFITS ---
  {
    id: 'm-corp-suit',
    label: 'Formal Corporate (Suit)',
    description: 'Dark suit, white shirt, plain tie.',
    gender: Gender.MALE,
    promptFragment: 'Lelaki dewasa, memakai suit gelap (navy atau charcoal), kemeja putih berlengan panjang, leher kemeja terurus, dasi polos (gelap), tiada jaket berlapisan berlebihan, kain wool/cotton, tanpa aksesori besar, ekspresi neutral. Exclude: tiada corak loud, tiada simbol/logo, tiada topi, tiada cermin mata gelap.'
  },
  {
    id: 'm-baju-melayu',
    label: 'Baju Melayu',
    description: 'Traditional Malay attire, Cekak Musang.',
    gender: Gender.MALE,
    promptFragment: 'Lelaki dewasa, memakai baju melayu plain lengan panjang (warna solid seperti dark green atau maroon), tanpa sampin untuk gambar rasmi, kolar cekak, kain matte, rambut kemas, ekspresi neutral. Exclude: tiada corak loud, tiada aksesori besar.'
  },
  {
    id: 'm-batik',
    label: 'Official Batik',
    description: 'Formal batik shirt with subtle motifs.',
    gender: Gender.MALE,
    promptFragment: 'Lelaki dewasa, baju batik formal warna gelap dengan motif kecil sahaja, kolar kemas (baju lengan panjang), bahan cotton/silk blend, tiada aksesori besar, ekspresi neutral. Exclude: tiada motif terlalu kontras, tiada logo.'
  },
  {
    id: 'm-kurta',
    label: 'Traditional Kurta',
    description: 'Solid color kurta, minimal design.',
    gender: Gender.MALE,
    promptFragment: 'Lelaki dewasa, kurta polos, warna solid atau motif kecil, tanpa perhiasan berat, rambut kemas, ekspresi neutral. Exclude: tiada aksesori mengaburi muka, tiada corak loud.'
  },
  {
    id: 'm-smart-casual',
    label: 'Smart Casual',
    description: 'Polo shirt or smart plain top.',
    gender: Gender.MALE,
    promptFragment: 'Lelaki dewasa, polo shirt polos (gelap atau neutral), kolar rapi, tiada corak/branding, lengan pendek atau panjang kemas, tanpa aksesori besar, ekspresi neutral. Exclude: tiada logo besar, tiada corak garis menonjol.'
  },
  {
    id: 'm-scrubs',
    label: 'Healthcare / Scrubs',
    description: 'Solid color medical scrubs.',
    gender: Gender.MALE,
    promptFragment: 'Lelaki dewasa, memakai scrubs hospital plain (solid color), kolar v sederhana, tiada lencana/reflection, rambut disimpan kemas, ekspresi neutral. Exclude: tiada alat perubatan di leher, tiada badge besar yang memantul.'
  },
  {
    id: 'm-company',
    label: 'Company Uniform',
    description: 'Standard private sector uniform.',
    gender: Gender.MALE,
    promptFragment: 'Lelaki dewasa, memakai uniform syarikat polos (non-government), kolar rapi, warna solid, tiada logo berlebih, nama tag minimal atau tiada, ekspresi neutral. Exclude: tiada logo besar/berkilat, tiada topi.'
  },
  {
    id: 'm-school',
    label: 'School Uniform',
    description: 'Standard student uniform (Kemeja + Tie).',
    gender: Gender.MALE,
    promptFragment: 'Remaja, memakai uniform sekolah rapi (kemeja putih + tie), rambut kemas, tiada aksesori, ekspresi neutral, latar belakang plain. Exclude: tiada lencana besar yang memantulkan cahaya, tiada topi.'
  },
  {
    id: 'm-id-basic',
    label: 'No-frills ID Look',
    description: 'Safe, plain contrast top for official ID.',
    gender: Gender.MALE,
    promptFragment: 'Lelaki dewasa, pakaian polos warna gelap/kontras (contoh: navy atas untuk latar putih), kolar rapi, tiada aksesori, rambut kemas, ekspresi neutral.'
  },
  {
    id: 'm-senior',
    label: 'Senior Formal',
    description: 'Conservative formal wear for seniors.',
    gender: Gender.MALE,
    promptFragment: 'Warga emas, pakaian formal sederhana (kemeja polos), kolar rapi, warna lembut gelap, rambut kemas, ekspresi neutral, tanpa aksesori berlebihan.'
  },

  // --- FEMALE OUTFITS ---
  {
    id: 'f-corp-blazer',
    label: 'Formal Corporate (Blazer)',
    description: 'Dark blazer & blouse.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita dewasa, blouse putih leher sederhana + blazer gelap, lengan panjang rapi, warna blouse polos, fabric cotton/silk blend, aksesori minimal (stud earrings sahaja), rambut rapi atau tudung kemas, ekspresi neutral. Exclude: tiada corak besar, tiada rantai tebal, tiada logo, tiada ekspresi tersenyum berlebihan.'
  },
  {
    id: 'f-baju-kurung',
    label: 'Baju Kurung',
    description: 'Modern Baju Kurung, solid color.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita dewasa, memakai baju kurung moden lengan panjang, warna solid (contoh: emerald, maroon, navy), kain matte (kain cotton atau rayon), tudung selendang padanan warna atau neutral (tudung labuh menutup dada), tiada perhiasan berlebihan, ekspresi neutral. Exclude: tiada corak corak besar/berkilat, tiada aksesori yang menutup muka.'
  },
  {
    id: 'f-tudung',
    label: 'Formal Hijab',
    description: 'Neat, neutral color hijab.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita muslimah, tudung labuh kemas menutup leher, warna neutral (beige, navy, hitam), tiada corak, tudung terikat rapi tanpa lapisan mengaburi muka, pakaian atas polos, ekspresi neutral. Exclude: tiada brooch besar di muka, tiada corak yang mengganggu.'
  },
  {
    id: 'f-batik',
    label: 'Official Batik',
    description: 'Formal batik wear.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita dewasa, baju batik formal warna gelap dengan motif kecil sahaja, kolar kemas, bahan cotton/silk blend, tiada aksesori besar, ekspresi neutral. Exclude: tiada motif terlalu kontras, tiada logo.'
  },
  {
    id: 'f-cheongsam',
    label: 'Cheongsam',
    description: 'Modern Cheongsam, solid/subtle motif.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita dewasa, cheongsam moden leher tinggi kecil, warna solid atau motif kecil, lengan pendek/panjang kemas, kain matte atau satin lembut, rambut kemas, ekspresi neutral. Exclude: tiada perhiasan besar, tiada motif mencolok.'
  },
  {
    id: 'f-saree',
    label: 'Saree',
    description: 'Simple saree with neat blouse.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita dewasa, saree sederhana (blouse rapi), warna solid atau motif kecil, tanpa perhiasan berat yang menutupi muka, rambut kemas, ekspresi neutral. Exclude: tiada aksesori mengaburi muka, tiada corak loud.'
  },
  {
    id: 'f-smart-casual',
    label: 'Smart Casual',
    description: 'Polo or smart plain top.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita dewasa, polo shirt polos (gelap atau neutral), kolar rapi, tiada corak/branding, lengan pendek atau panjang kemas, tanpa aksesori besar, ekspresi neutral. Exclude: tiada logo besar, tiada corak garis menonjol.'
  },
  {
    id: 'f-scrubs',
    label: 'Healthcare / Scrubs',
    description: 'Solid color medical scrubs.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita dewasa, memakai scrubs hospital plain (solid color), kolar v sederhana, tiada lencana/reflection, rambut disimpan kemas atau tudung yang sesuai, ekspresi neutral. Exclude: tiada alat perubatan di leher, tiada badge besar yang memantul.'
  },
  {
    id: 'f-company',
    label: 'Company Uniform',
    description: 'Standard private sector uniform.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita dewasa, memakai uniform syarikat polos (non-government), kolar rapi, warna solid, tiada logo berlebih, nama tag minimal atau tiada, ekspresi neutral. Exclude: tiada logo besar/berkilat, tiada topi.'
  },
  {
    id: 'f-school',
    label: 'School Uniform',
    description: 'Standard student uniform.',
    gender: Gender.FEMALE,
    promptFragment: 'Remaja, memakai uniform sekolah rapi (baju sekolah wanita), rambut kemas, tiada aksesori, ekspresi neutral, latar belakang plain. Exclude: tiada lencana besar yang memantulkan cahaya, tiada topi.'
  },
  {
    id: 'f-id-basic',
    label: 'No-frills ID Look',
    description: 'Safe, plain contrast top.',
    gender: Gender.FEMALE,
    promptFragment: 'Wanita dewasa, pakaian polos warna gelap/kontras (contoh: navy atas untuk latar putih), kolar rapi, tiada aksesori, rambut kemas atau tudung kemas, ekspresi neutral.'
  },
  {
    id: 'f-senior',
    label: 'Senior Formal',
    description: 'Conservative formal wear.',
    gender: Gender.FEMALE,
    promptFragment: 'Warga emas wanita, pakaian formal sederhana (blouse polos), kolar rapi, warna lembut gelap, rambut kemas, ekspresi neutral, tanpa aksesori berlebihan.'
  }
];

export const BACKGROUND_PROMPTS: Record<BackgroundColor, string> = {
  [BackgroundColor.WHITE]: 'a solid plain off-white background (hex #F5F5F5), professional studio lighting, no shadows, matte finish',
  [BackgroundColor.BLUE]: 'a solid plain blue background (hex color #2E9AFF), flat color, no gradients, passport photo style',
  [BackgroundColor.GREY]: 'a neutral grey professional photography backdrop',
  [BackgroundColor.OFFICE]: 'a blurred modern office background with bokeh effect, depth of field'
};