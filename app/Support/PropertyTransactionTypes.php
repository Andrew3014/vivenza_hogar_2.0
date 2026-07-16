<?php

namespace App\Support;

final class PropertyTransactionTypes
{
    public const SALE = 'venta';
    public const RENT = 'alquiler';
    public const ANTICHRETIC = 'anticretico';
    public const DAILY_RENT = 'alquiler_diario';

    /** @return list<string> */
    public static function all(): array
    {
        return [self::SALE, self::RENT, self::ANTICHRETIC, self::DAILY_RENT];
    }
}
