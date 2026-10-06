<?php
/**
 * Plugin Name: StudyHub Language API
 * Description: Public language filtering and published translation links for Polylang Free.
 */
if (!defined('ABSPATH')) { exit; }

add_action('rest_api_init', function () {
    register_rest_field('post', 'studyhub_language', [
        'get_callback' => function ($post) {
            return function_exists('pll_get_post_language') ? (pll_get_post_language($post['id'], 'slug') ?: 'uk') : 'uk';
        },
        'schema' => ['type' => 'string', 'context' => ['view']],
    ]);
    register_rest_field('post', 'studyhub_translations', [
        'get_callback' => function ($post) {
            $translations = [];
            $ids = function_exists('pll_get_post_translations') ? pll_get_post_translations($post['id']) : ['uk' => $post['id']];
            foreach ($ids as $language => $id) {
                if (in_array($language, ['uk', 'en'], true) && get_post_status($id) === 'publish' && !post_password_required($id)) {
                    $translations[$language] = get_post_field('post_name', $id);
                }
            }
            return (object) $translations;
        },
        'schema' => ['type' => 'object', 'context' => ['view']],
    ]);
    register_rest_field('category', 'studyhub_language', [
        'get_callback' => function ($term) {
            return function_exists('pll_get_term_language') ? (pll_get_term_language($term['id'], 'slug') ?: 'uk') : 'uk';
        },
        'schema' => ['type' => 'string', 'context' => ['view']],
    ]);
});
foreach (['post', 'category'] as $type) {
    add_filter("rest_{$type}_collection_params", function ($params) {
        $params['lang'] = ['description' => 'StudyHub content language', 'type' => 'string', 'enum' => ['uk', 'en']];
        return $params;
    });
}
add_filter('rest_post_query', function ($args, $request) {
    $language = $request->get_param('lang');
    if (!$language) { return $args; }
    if (!function_exists('pll_get_post_language')) {
        if ($language === 'en') { $args['post__in'] = [0]; }
        return $args;
    }
    $args['lang'] = $language;
    // Explicit taxonomy filtering also applies when Polylang has no current frontend language.
    $clauses = [];
    if (!empty($args['tax_query'])) { $clauses[] = $args['tax_query']; }
    $clauses[] = ['taxonomy' => 'language', 'field' => 'slug', 'terms' => $language];
    $args['tax_query'] = array_merge(['relation' => 'AND'], $clauses);
    return $args;
}, 20, 2);
add_filter('rest_category_query', function ($args, $request) {
    $language = $request->get_param('lang');
    if (!$language) { return $args; }
    if (!function_exists('pll_get_term_language')) {
        if ($language === 'en') { $args['include'] = [0]; }
        return $args;
    }
    $ids = get_terms(['taxonomy' => 'category', 'hide_empty' => false, 'fields' => 'ids', 'lang' => $language]);
    $args['include'] = is_wp_error($ids) || !$ids ? [0] : $ids;
    $args['lang'] = $language;
    return $args;
}, 20, 2);
