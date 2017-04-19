<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contract\SpaceRepositoryContract;
use App\Repositories\SpaceEloquentRepository;
use App\Repositories\Contract\CtgRepositoryContract;
use App\Repositories\CtgEloquentRepository;
use App\Repositories\Contract\UserRepositoryContract;
use App\Repositories\UserEloquentRepository;
use App\Repositories\Contract\ProfileRepositoryContract;
use App\Repositories\ProfileEloquentRepository;
use App\Repositories\Contract\SpaceCtgRepositoryContract;
use App\Repositories\SpaceCtgEloquentRepository;
use App\Repositories\Contract\ItemRepositoryContract;
use App\Repositories\ItemEloquentRepository;
use App\Repositories\Contract\FriendsRepositoryContract;
use App\Repositories\FriendsEloquentRepository;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(UserRepositoryContract::class, UserEloquentRepository::class);
        $this->app->bind(SpaceRepositoryContract::class, SpaceEloquentRepository::class);
        $this->app->bind(CtgRepositoryContract::class, CtgEloquentRepository::class);
        $this->app->bind(SpaceCtgRepositoryContract::class, SpaceCtgEloquentRepository::class);
        $this->app->bind(ItemRepositoryContract::class, ItemEloquentRepository::class);
        $this->app->bind(ProfileRepositoryContract::class, ProfileEloquentRepository::class);
        $this->app->bind(FriendsRepositoryContract::class, FriendsEloquentRepository::class);
    }

}
