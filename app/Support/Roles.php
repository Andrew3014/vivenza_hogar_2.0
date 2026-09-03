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

    /** @return list<string> - Quién puede publicar propiedades (necesita plan activo) */
    public static function publishers(): array
    {
        return [self::CLIENT];
    }

    /** @return list<string> - Staff de la empresa (verifican, atienden) */
    public static function staff(): array
    {
        return [self::ADMIN, self::AGENT];
    }

    /** @return list<string> - Quién puede acceder a panel admin */
    public static function adminAccess(): array
    {
        return [self::ADMIN];
    }

    /** @return list<string> - Quién puede acceder a panel agente */
    public static function agentAccess(): array
    {
        return [self::AGENT, self::ADMIN];
    }
}
