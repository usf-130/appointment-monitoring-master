import localFont from 'next/font/local'

export const iransans = localFont({
  variable: '--iransans',
  src: [
    {
      path: './IRANSansWeb_Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: './IRANSansWeb_Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: './IRANSansWeb_Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './IRANSansWeb_Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './IRANSansWeb_UltraLight.woff2',
      weight: '200',
      style: 'normal',
    },
    {
      path: './IRANSansWeb.woff2',
      weight: 'normal',
      style: 'normal',
    },
  ],
});