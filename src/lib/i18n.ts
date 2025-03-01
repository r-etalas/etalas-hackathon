import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            showcase: {
                title: "Wedding Showcase",
                filters: {
                    searchPlaceholder: "Search by video name",
                    location: "Select Location",
                    weddingSize: "Wedding Size",
                    month: "Select Month",
                    sizes: {
                        small: "10-50 guests",
                        medium: "50-100 guests",
                        large: "100+ guests"
                    }
                },
                details: {
                    location: "Location",
                    weddingSize: "Wedding Size",
                    month: "Month",
                    organizer: "Organizer",
                    vendors: "Vendors"
                }
            }
        }
    },
    zh: {
        translation: {
            showcase: {
                title: "婚礼展示",
                filters: {
                    searchPlaceholder: "按视频名称搜索",
                    location: "选择地点",
                    weddingSize: "婚礼规模",
                    month: "选择月份",
                    sizes: {
                        small: "10-50位宾客",
                        medium: "50-100位宾客",
                        large: "100位以上宾客"
                    }
                },
                details: {
                    location: "地点",
                    weddingSize: "婚礼规模",
                    month: "月份",
                    organizer: "策划师",
                    vendors: "供应商"
                }
            }
        }
    },
    ko: {
        translation: {
            showcase: {
                title: "웨딩 쇼케이스",
                filters: {
                    searchPlaceholder: "비디오 이름으로 검색",
                    location: "장소 선택",
                    weddingSize: "웨딩 규모",
                    month: "월 선택",
                    sizes: {
                        small: "10-50명 하객",
                        medium: "50-100명 하객",
                        large: "100명 이상 하객"
                    }
                },
                details: {
                    location: "장소",
                    weddingSize: "웨딩 규모",
                    month: "월",
                    organizer: "웨딩플래너",
                    vendors: "업체"
                }
            }
        }
    },
    ja: {
        translation: {
            showcase: {
                title: "ウェディングショーケース",
                filters: {
                    searchPlaceholder: "ビデオ名で検索",
                    location: "場所を選択",
                    weddingSize: "結婚式の規模",
                    month: "月を選択",
                    sizes: {
                        small: "10-50名のゲスト",
                        medium: "50-100名のゲスト",
                        large: "100名以上のゲスト"
                    }
                },
                details: {
                    location: "場所",
                    weddingSize: "結婚式の規模",
                    month: "月",
                    organizer: "プランナー",
                    vendors: "業者"
                }
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n; 