'use client';
import {useEffect} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {canonicalHref} from '@/lib/routing/site-routes';
export function CanonicalRouting(){const pathname=usePathname(),router=useRouter();useEffect(()=>{if(!pathname.startsWith('/preview/'))return;const target=canonicalHref(pathname+window.location.search+window.location.hash);if(target!==pathname+window.location.search+window.location.hash)router.replace(target);},[pathname,router]);return null;}
