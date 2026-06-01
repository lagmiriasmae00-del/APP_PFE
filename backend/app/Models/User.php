<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function reponses()
    {
        return $this->hasMany(UserReponse::class);
    }

    public function results()
    {
        return $this->hasMany(Result::class);
    }

    

    public function getNiveauAttribute()
    {
        return $this->profile?->niveau;
    }
}
