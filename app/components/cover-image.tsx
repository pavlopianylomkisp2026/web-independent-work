'use client';

import Image from 'next/image';
import { useState } from 'react';

type Cover = { src: string; alt: string; width: number; height: number };
export default function CoverImage({ cover, className, priority = false }: { cover?: Cover; className: string; priority?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string>();
  if (!cover || failedSrc === cover.src) return null;
  // The browser loads WordPress media directly, including local Docker URLs.
  // Server-side image optimization cannot reliably access a user's local CMS.
  return <Image src={cover.src} alt={cover.alt} width={cover.width} height={cover.height} className={className} unoptimized loading={priority ? 'eager' : 'lazy'} onError={() => setFailedSrc(cover.src)}/>;
}
