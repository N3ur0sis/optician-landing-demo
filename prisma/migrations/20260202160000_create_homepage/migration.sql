-- Create protected homepage if it doesn't exist
-- This page cannot be deleted and is managed via the Grid Manager

INSERT INTO "Page" (
  "id",
  "slug",
  "title",
  "metaTitle",
  "metaDescription",
  "published",
  "publishedAt",
  "template",
  "backgroundColor",
  "textColor",
  "showNavbarTitle",
  "showInNav",
  "navOrder",
  "createdAt",
  "updatedAt"
)
SELECT
  'homepage-protected-001',
  'accueil',
  'Accueil',
  'Optique de Bourbon | Votre opticien à La Réunion depuis 1981',
  'Optique de Bourbon, votre opticien santé à La Réunion depuis plus de 40 ans.',
  true,
  NOW(),
  'default',
  '#ffffff',
  '#171717',
  false,
  false,
  0,
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM "Page" 
  WHERE "slug" = 'accueil' 
     OR "slug" = '/' 
     OR "slug" = 'home'
     OR "slug" = ''
);
