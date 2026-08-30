export interface CatalogueImageView {
  src: string;
  alt: string;
}

export interface CatalogueCategoryView {
  slug: string;
  title: string;
  description: string;
  cover: CatalogueImageView;
  images: CatalogueImageView[];
}
