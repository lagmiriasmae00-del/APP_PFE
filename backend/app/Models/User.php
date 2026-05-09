<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\UserProfile;
use App\Models\UserReponse;
use App\Models\Result;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'niveau', // ضروري تزيد هادي حيت كينة فـ جدول users
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
}
