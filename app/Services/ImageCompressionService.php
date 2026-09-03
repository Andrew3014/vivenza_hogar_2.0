<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class ImageCompressionService
{
    /**
     * Compress and convert image to WebP 85% quality.
     *
     * @param UploadedFile $file
     * @param string $path
     * @param int $maxWidth
     * @param int $quality
     * @return string The stored file path
     */
    public function compressAndConvertToWebP(UploadedFile $file, string $path, int $maxWidth = 1920, int $quality = 85): string
    {
        $image = Image::make($file)
            ->resize($maxWidth, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            })
            ->encode('webp', $quality);

        $filename = Str::random(40) . '.webp';
        $fullPath = $path . '/' . $filename;

        Storage::disk('public')->put($fullPath, $image->encoded);

        return $fullPath;
    }

    /**
     * Compress multiple images.
     *
     * @param array<UploadedFile> $files
     * @param string $path
     * @param int $maxWidth
     * @param int $quality
     * @return array<int, string>
     */
    public function compressMultiple(array $files, string $path, int $maxWidth = 1920, int $quality = 85): array
    {
        $paths = [];

        foreach ($files as $file) {
            if ($file->isValid()) {
                $paths[] = $this->compressAndConvertToWebP($file, $path, $maxWidth, $quality);
            }
        }

        return $paths;
    }

    /**
     * Generate optimized thumbnail.
     *
     * @param UploadedFile $file
     * @param string $path
     * @param int $width
     * @param int $height
     * @param int $quality
     * @return string
     */
    public function generateThumbnail(UploadedFile $file, string $path, int $width = 400, int $height = 300, int $quality = 80): string
    {
        $image = Image::make($file)
            ->fit($width, $height)
            ->encode('webp', $quality);

        $filename = Str::random(40) . '_thumb.webp';
        $fullPath = $path . '/' . $filename;

        Storage::disk('public')->put($fullPath, $image->encoded);

        return $fullPath;
    }

    /**
     * Compress PDF document.
     *
     * @param UploadedFile $file
     * @param string $path
     * @return string
     */
    public function compressDocument(UploadedFile $file, string $path): string
    {
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $fullPath = $path . '/' . $filename;

        Storage::disk('public')->putFileAs($path, $file, $filename);

        return $fullPath;
    }
}