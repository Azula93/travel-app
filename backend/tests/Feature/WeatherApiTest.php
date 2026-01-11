<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WeatherApiTest extends TestCase
{
    /** @test */
    public function it_returns_weather_for_a_city()
    {
        $response = $this->getJson('/api/weather?city=Bogota');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'name',
                    'main' => ['temp', 'humidity', 'pressure'],
                    'weather' => [['id', 'main', 'description', 'icon']],
                    'wind' => ['speed']
                ]
            ]);
    }

    /** @test */
    public function it_returns_error_if_city_missing()
    {
        $response = $this->getJson('/api/weather');

        $response->assertStatus(400)
            ->assertJson([
                'error' => 'City is required'
            ]);
    }
}
