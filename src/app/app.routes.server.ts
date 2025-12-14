import { RenderMode, ServerRoute } from '@angular/ssr';

// Only prerender the public welcome route; render all other routes on the client
export const serverRoutes: ServerRoute[] = [
    {
        path: 'welcome',
        renderMode: RenderMode.Prerender,
    },
    {
        path: '**',
        renderMode: RenderMode.Client,
    },
];
