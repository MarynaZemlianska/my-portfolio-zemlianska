// Single source of truth for page URLs in every language.
// Pages declare `key` + `lang` in front matter; permalinks, nav links
// and the language switcher are all derived from this map.
export default {
    home: { uk: "/", en: "/en/" },
    projects: { uk: "/projects/", en: "/en/projects/" },
    landing: { uk: "/services/landing-page/", en: "/en/services/landing-page/" },
    business: { uk: "/services/business-website/", en: "/en/services/business-website/" },
    corporate: { uk: "/services/corporate-website/", en: "/en/services/corporate-website/" },
    personal: { uk: "/services/personal-website/", en: "/en/services/personal-website/" },
    ecommerce: { uk: "/services/e-commerce/", en: "/en/services/e-commerce/" },
    other: { uk: "/services/additional/", en: "/en/services/additional/" },
    privacy: { uk: "/privacy/", en: "/en/privacy/" },
};
