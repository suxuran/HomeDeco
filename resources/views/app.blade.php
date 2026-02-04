<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>HomeDeco</title>

        {{-- 1. THIS IS THE MISSING LINE --}}
        @viteReactRefresh

        {{-- 2. Your App Assets --}}
        @vite(['client/global.css', 'client/App.tsx'])
    </head>
    <body class="bg-background text-foreground">
        <div id="root"></div>
    </body>
</html>