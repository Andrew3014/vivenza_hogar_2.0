<?php

namespace App\Support;

final class Roles
{
    public const ADMIN = 'admin';
    public const AGENT = 'agente';
    public const CLIENT = 'cliente';

    /** @return list<string> */
    public static function all(): array
    {
        return [self::ADMIN, self::AGENT, self::CLIENT];
    }

    /** @return list<string> */
    public static function publishers(): array
    {
        return [self::AGENT, self::CLIENT];
    }
}
