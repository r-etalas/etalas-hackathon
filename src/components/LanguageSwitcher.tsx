import { useTranslation } from 'react-i18next';
import { Language } from '@mui/icons-material';
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import '@/lib/i18n';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '日本語' },
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (event: SelectChangeEvent) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="language-select-label">Language</InputLabel>
            <Select
                labelId="language-select-label"
                value={i18n.language}
                onChange={handleLanguageChange}
                label="Language"
                IconComponent={() => <Language fontSize="small" />}
            >
                {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LanguageSwitcher; 