import { useState } from 'react';
// @mui
import { MenuItem, Stack } from '@mui/material';
// hooks
// components
// import Image from '../../../components/Image';
// import MenuPopover from '../../../components/MenuPopover';
import { Image, MenuPopover } from '@beta-titan/ledger/frontend/utilities/core-components';
import { IconButtonAnimate } from '@beta-titan/ledger/frontend/utilities/ui-settings-fe';
import { ELanguage, useLangContext } from '../../multi-language/language-context';

// ----------------------------------------------------------------------

export default function LanguagePopover() {

  const {current, t, changeLanguage, languageOptions} = useLangContext()

  const [open, setOpen] = useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleChangeLang = (newLang: ELanguage) => {
    changeLanguage(newLang);
    handleClose();
  };

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          ...(open && { bgcolor: 'action.selected' }),
        }}
      >
        <Image disabledEffect src={languageOptions[current].icon} alt={languageOptions[current].label} />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          {Object.keys(languageOptions).map((key => languageOptions[key])).map(option => {
            return <MenuItem
            key={option.value}
            selected={option.value === current}
            onClick={() => {
              handleChangeLang(option.value)
            }
          }

          >
            <Image
              disabledEffect
              alt={option.label}
              src={option.icon}
              sx={{ width: 28, mr: 2 }}
            />

            {option.label}
          </MenuItem>
          })}
          {/* {allLangs.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === currentLang.value}
              onClick={() => handleChangeLang(option.value)}
            >
              <Image
                disabledEffect
                alt={option.label}
                src={option.icon}
                sx={{ width: 28, mr: 2 }}
              />

              {option.label}
            </MenuItem>
          ))} */}
        </Stack>
      </MenuPopover>
    </>
  );
}
