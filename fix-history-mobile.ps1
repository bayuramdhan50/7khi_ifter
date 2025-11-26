# Script untuk memperbaiki semua file history agar mobile responsive
$files = @(
    "resources\js\pages\siswa\activities\history\gemar-belajar-history.tsx",
    "resources\js\pages\siswa\activities\history\bermasyarakat-history.tsx",
    "resources\js\pages\siswa\activities\history\tidur-cepat-history.tsx",
    "resources\js\pages\siswa\activities\history\beribadah-nonmuslim-history.tsx"
)

$replacements = @{
    # Activity card badge
    'w-10 h-10 bg-green-500' = 'w-8 h-8 sm:w-10 sm:h-10 bg-green-500'
    'text-white font-bold text-lg' = 'text-white font-bold text-base sm:text-lg'
    
    # Activity card padding
    'p-8 flex items-center' = 'p-4 sm:p-8 flex items-center'
    'rounded-2xl p-6 w-full' = 'rounded-xl sm:rounded-2xl p-3 sm:p-6 w-full'
    'p-4 text-center' = 'p-3 sm:p-4 text-center'
    'font-bold text-gray-800">{activity' = 'font-bold text-gray-800 text-sm sm:text-base">{activity'
    
    # Buttons
    'space-y-3">' = 'flex lg:flex-col gap-2 sm:gap-3">'
    'w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg text-center block"' = 'flex-1 lg:w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-center block text-sm sm:text-base"'
    
    # Main content
    'flex-1">' = 'flex-1 min-w-0">'
    'flex items-center justify-between mb-8">' = 'flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-8 gap-2">'
    'text-2xl font-bold text-blue-900">' = 'text-lg sm:text-2xl font-bold text-blue-900">'
    'text-2xl font-bold text-blue-900">(\s+)Bulan' = 'text-base sm:text-2xl font-bold text-blue-900">$1Bulan'
    
    # Filter
    'mb-4 flex items-center gap-2">' = 'mb-3 sm:mb-4 flex items-center gap-2">'
    'text-sm font-medium text-gray-700">Show' = 'text-xs sm:text-sm font-medium text-gray-700">Show'
    'px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700">' = 'px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium bg-white text-gray-700">'
    'text-sm font-medium text-gray-700">entries' = 'text-xs sm:text-sm font-medium text-gray-700">entries'
    
    # Table
    'rounded-2xl shadow-lg overflow-hidden">' = 'rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">'
    'w-full">' = 'w-full min-w-max">'
    'border-b-2 border-gray-200">' = 'border-b-2 border-gray-200 bg-gray-50">'
    'py-4 px-4 text-center font-bold text-gray-700">' = 'py-2 sm:py-4 px-2 sm:px-4 text-center font-bold text-gray-700 text-xs sm:text-sm whitespace-nowrap">'
    'border-b border-gray-200 hover:bg-gray-50">' = 'border-b border-gray-200 hover:bg-gray-50 transition-colors">'
    'py-3 px-4">' = 'py-2 sm:py-3 px-2 sm:px-4">'
    'w-14 h-14 bg-gray-100' = 'w-10 h-10 sm:w-14 sm:h-14 bg-gray-100'
    'text-xl font-bold text-gray-700">{day}' = 'text-base sm:text-xl font-bold text-gray-700">{day}'
    'w-6 h-6 border-2' = 'w-5 h-5 sm:w-6 sm:w-6 border-2'
    'h-10 w-20 items-center' = 'h-8 w-16 sm:h-10 sm:w-20 items-center'
    'h-8 w-8 transform' = 'h-6 w-6 sm:h-8 sm:w-8 transform'
    'translate-x-11"' = 'translate-x-9 sm:translate-x-11"'
    'w-16 h-16 bg-gray-100' = 'w-12 h-12 sm:w-16 sm:h-16 bg-gray-100'
    'h-8 w-8 text-gray-400"' = 'h-6 w-6 sm:h-8 sm:w-8 text-gray-400"'
    'px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-semibold">' = 'px-2 sm:px-4 py-1 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm font-semibold whitespace-nowrap">'
    'Lihat Detail' = 'Lihat'
    
    # Pagination
    'flex items-center justify-center gap-2 p-4 border-t border-gray-200">' = 'flex flex-wrap items-center justify-center gap-1 sm:gap-2 p-3 sm:p-4 border-t border-gray-200">'
    'px-3 py-2 rounded-lg text-sm font-medium' = 'px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium'
    'text-sm text-gray-600 ml-2">Halaman' = 'text-xs sm:text-sm text-gray-600 ml-1 sm:ml-2 w-full sm:w-auto text-center sm:text-left mt-1 sm:mt-0">Halaman'
    
    # Calendar
    'w-80 flex-shrink-0">' = 'hidden xl:block w-80 flex-shrink-0">'
}

foreach ($file in $files) {
    Write-Host "Processing $file..." -ForegroundColor Cyan
    $content = Get-Content $file -Raw
    
    foreach ($key in $replacements.Keys) {
        $content = $content -replace [regex]::Escape($key), $replacements[$key]
    }
    
    Set-Content -Path $file -Value $content -NoNewline
    Write-Host "✓ Done!" -ForegroundColor Green
}

Write-Host "`nAll files updated!" -ForegroundColor Green
