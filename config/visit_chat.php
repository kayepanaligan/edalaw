<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Forbidden chat keywords (auto-flag messages containing these)
    |--------------------------------------------------------------------------
    */
    'forbidden_keywords' => array_values(array_filter(array_map('trim', explode(',', env('VISIT_CHAT_FORBIDDEN_KEYWORDS', 'escape,weapon,drugs,contraband'))))),

];
