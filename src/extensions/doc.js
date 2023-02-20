export const DOCUMENTATION = {
  HTTP: {
    NAME: 'HTTP',
    get_request_many_json: `[callback, ...promises] -> responses`,
    get_request_many_text: `[callback, ...promises] -> responses`,
    get_request_single_json: `[url, callback] -> void`,
    get_request_single_text: `[url, callback] -> void`,
  },
  ARRAY: {
    from: `[data] -> array`,
    split_new_line: `[string] -> array`,
    split_spaces: `[string] -> array`,
    split: `[string, separator] -> array`,
    join: `[string, separator] -> string`,
    shuffle: `[array] -> array`,
    zeroes: `[size] -> array`,
    ones: `[size] -> array`,
    range: `[start, end, step] -> array`,
  },
  BITWISE: {
    NAME: 'BITWISE',
    make_bit: `[number] -> string`,
    and: `[number, number] -> number`,
    not: `[number] -> number`,
    or: `[number, number] -> number`,
    xor: `[number, number] -> number`,
    left_shift: `[number, number] -> number`,
    right_shift: `[number, number] -> number`,
    un_right_shift: `[number, number] -> number`,
  },
  LOGIC: {
    LOGIC: {
      NAME: 'LOGIC',
      is_string: `[uknown] -> 0|1`,
      is_number: `[uknown] -> 0|1`,
      is_not_string: `[uknown] -> 0|1`,
      is_not_number: `[uknown] -> 0|1`,
      is_not_array: `[uknown] -> 0|1`,
      is_array: `[uknown] -> 0|1`,
      is_map: `[uknown] -> 0|1`,
      is_not_map: `[uknown] -> 0|1`,
      is_true: `[uknown] -> 0|1`,
      is_false: `[uknown] -> 0|1`,
      is_equal: `[uknown] -> 0|1`,
    },
  },
  DOM: {
    NAME: 'DOM',
    append_child: `[parent, child] -> parent`,
    get_body: `[] -> .[document; "body"]`,
    get_text_content: `[element] -> string`,
    get_value: `[element] -> string`,
    get_parent_node: `[element] -> . [element; "parentNode"]`,
    make_fragment: `[] -> fragment`,
    get_element_by_id: `[id] -> element`,
    get_elements_by_class_name: `[tag] -> elements`,
    get_elements_by_tag_name: `[tag] -> element`,
    make_user_interface: `[] -> div`,
    make_image: `[src] -> img`,
    make_iframe: `[src] -> iframe`,
    make_element: `[type, settings] -> element`,
    make_canvas: `[settings] -> element`,
    make_input: `[settings] -> element`,
    make_textarea: `[settings] -> element`,
    make_checkbox: `[] -> checkbox`,
    make_slider: `[settings] -> element`,
    copy_from_element: `[copy element] -> copy`,
    copy_from_text: `[val] -> void`,
    make_tooltip: `[defaultLabel] -> tooltip`,
    make_table: `[] -> element`,
    make_table_row: `[] -> element`,
    make_table_data: `[] -> element`,
    make_table_header: `[] -> element`,
    make_table_caption: `[] -> element`,
    make_table_column: `[] -> element`,
    make_table_column_group: `[] -> element`,
    make_table_head: `[] -> element`,
    make_table_body: `[] -> element`,
    make_table_footer: `[] -> element`,
    make_button: `[] -> element`,
    make_progress: `[] -> element`,
    make_indeterminate_progress: `[] -> element`,
    add_text_content: `[element, label] -> element`,
    make_label: `[element] -> element`,
    make_header: `[n] -> element`,
    make_nav: `[elements] -> element`,
    article: `[elements] -> element`,
    make_list: `[] -> element`,
    make_css_link: `[href] -> element`,
    load_bulma: `[v_number_1, v_number_2, v_number_3] -> element`,
    make_ordered_list: `[...lists] -> element`,
    make_unordered_list: `[...lists] -> element`,
    make_anchor: `[href] -> element`,
    make_pre: `[] -> element`,
    make_paragraph: `[] -> element`,
    make_span: `[] -> element`,
    set_id: `[element, id] -> element`,
    make_table_from: `[tableData] -> element`,
    get_id: `[element] -> attribute`,
    get_attribute: `[element, key] -> attribute`,
    set_attribute: `[element, key, value] -> element`,
    set_textcontent: `[element, content] -> element`,
    set_style: `[element, ...styles] -> element`,
    make_container: `[...elements] -> element`,
    make_div: `[...elements] -> element`,
    make_italic_text: `[] -> element`,
    make_strong_text: `[] -> element`,
    insert_into_container: `[container, ...elements] -> element`,
    remove_self_from_container: `[...elements] -> element`,
  },
  STYLE: {
    NAME: 'STYLE',
    make_style: `[...styles] -> element`,
    add_class: `[element, ...classlist] -> element`,
    no_border: `[] -> string`,
    border_radius: `[value] -> string`,
    border: `[options] -> string`,
    margin: `[options] -> string`,
    padding: `[options] -> string`,
    display: `[display] -> string`,
    units_percent: `[value] -> string`,
    units_pixel: `[value] -> string`,
    units_point: `[value] -> string`,
    background_color: `[color] -> string`,
    cursor_pointer: `[] -> string`,
    font_family: `[font] -> string`,
    fontsize: `[size] -> string`,
    display_show: `[element] -> string`,
    display_hide: `[element] -> string`,
    text_color: `[color] -> string`,
    text_align: `[align] -> string`,
    style_option: `[attr] -> option`,
  },
  EVENT: {
    NAME: 'EVENT',
    on_input_change: `[element, callback] -> element`,
    on_mouse_click: `[element, callback] ->  element`,
    on_mouse_over: `[element, callback] -> element`,
    on_key_down: `[element, callback] -> element`,
    on_key_up: `[element, callback] -> element`,
  },
  COLOR: {
    NAME: 'COLOR',
    make_rgb_color: `[r, g, b] -> string`,
    make_rgba_color: `[r, g, b, a] -> string`,
    random_color: `[] -> string`,
    random_light_color: `[] -> string`,
    rgb_to_hex: `[color] -> string`,
    invert_hex_color: `[hex] -> string`,
  },
  SKETCH_COMMANDS: {
    NAME: 'COMMANDS',
    MOVE: `[] -> string`,
    CURVE: `[] -> string`,
    LINE: `[] -> string`,
  },
  SKETCH_PATH: {
    NAME: 'PATH',
    path_from: `[points] -> path`,
    make_path: `[...points] -> path`,
    path: `[anchors, a, b, c] -> path`,
  },
  SKETCH_VECTOR: {
    NAME: 'VECTOR',
    make_vector: `[...args] -> vector`,
    ZERO: `[] -> number`,
    LEFT: `[] -> number`,
    RIGHT: `[] -> number`,
    UP: `[] -> number`,
    DOWN: `[] -> number`,
    add: `[a, b] -> vector`,
    sub_tract: `[a, b] -> vector`,
    multiply: `[a, b] -> vector`,
    divide: `[a, b] -> vector`,
    dot: `[a, b] -> vector`,
    normalize: `[v] -> vector`,
    ratio_between: `[a, b] -> vector`,
    angle_between: `[a, b] -> vector`,
    distance_between: `[a, b] -> vector`,
    distance_between_squared: `[a, b] -> vector`,
    distance_to: `[a, b, e] -> vector`,
    distance_to_squared: `[a, b, e] -> vector`,
    get_x: `[v] -> number`,
    get_y: `[v] -> number`,
    copy: `[a, b] -> vector`,
    clear: `[v] -> vector`,
    clone: `[v] -> vector`,
    lerp: `[v, d, t] -> vector`,
    add_self: `[v, a] -> vector`,
    subtract_self: `[v, a] -> vector`,
    multiply_self: `[v, a] -> vector`,
    multiply_scalar: `[v, scalar] -> vector`,
    divide_scalar: `[v, scalar] -> vector`,
    set_length: `[v, len] -> vector`,
    length: `[v] -> vector`,
    rotate: `[v, angle] -> vector`,
  },
  SKETCH_ANCHOR: {
    NAME: 'ANCHOR',
    anchor: `[p1, p2, p3, p4, p5, p6, p7] -> anchor`,
  },
  SKETCH: {
    NAME: 'SKETCH',
    background: `[color] -> color`,
    request_animation_frame: `[fn] -> number`,
    destroy_composition: `[] -> void`,
    make_scene: `[width, height, callback] -> string`,
    insert_into_group: `[group, ...items] -> group`,
    insert_into_group_by_partitions: `[group, ...partitions) -> group`,
    group_additions: `[group] -> additions`,
    group_children: `[group] -> children`,
    remove_from_group: `[item] -> item`,
    remove_from_scene: `[item] -> void`,
    width: `[ratio] -> number`,
    height: `[ratio] -> number`,
    add: `[...elements] -> elements`,
    clear: `[] -> void`,
    ignore: `[...args] -> void`,
    listen: `[...args] -> void`,
    load: `[...args] -> void`,
    make_arc_segment: `[x, y, innerRadius, outerRadius, startAngle, endAngle, resolution] -> element`,
    make_arrow: `[x1, y1, x2, y2] -> element`,
    make_circle: `[x, y, r] -> element`,
    make_curve: `[...points] -> element`,
    make_ellipse: `[x, y,	rx,	ry,	resolution] -> element`,
    make_group: `[...args] -> element`,
    make_image_sequence: `[...args] -> element`,
    make_line: `[x1, y1, x2, y2, color] -> element`,
    make_linear_gradient: `[...args] -> element`,
    make_path: `[...args] -> element`,
    make_points: `[...args] -> element`,
    make_polygon: `[x, y, radius, sides] -> element`,
    make_radial_gradient: `[...args] -> element`,
    make_rectangle: `[x, y, w, h] -> element`,
    make_rounded_rectangle: `[...args] -> element`,
    make_sprite: `[src, x, y, columns, rows, frameRate, autostart] -> element`,
    sprite_play: `[sprite, firstFrame, lastFrame, onLastFrame] -> sprite`,
    sprite_stop: `[sprite) -> sprite`,
    sprite_pause: `[sprite) -> sprite`,
    make_star: `[x, y, outerRadius, innerRadius, sides] -> element`,
    make_text: `[x, y, styles] -> element`,
    make_texture: `[...args] -> element`,
    on: `[...args] -> string`,
    off: `[...args] -> string`,
    pause: `[...args] -> string`,
    play: `[...args] -> string`,
    release: `[...args] -> string`,
    remove: `[...args] -> string`,
    set_playing: `[...args] -> string`,
    trigger: `[...args] -> string`,
    update: `[...args] -> string`,
    no_fill: `[entity] -> entity`,
    no_stroke: `[entity] -> entity`,
    draw: `[lifespan, callback] -> void`,
    set_screen_size: `[w, h, showBorder] -> void`,
    set_offset_start: `[entity] -> entity`,
    set_fill: `[entity, fill] -> entity`,
    set_stroke: `[entity, stroke] -> entity`,
    set_dashes: `[entity, dashes] -> entity`,
    set_line_width: `[entity, linewidth] -> entity`,
    offset_by: `[entity, x, y] -> entity`,
    set_position: `[entity, x, y] -> entity`,
    set_position_x: `[entity, x] -> entity`,
    set_position_y: `[entity, y] -> entity`,
    set_scale: `[entity, s] -> entity`,
    set_opacity: `[entity, o] -> entity`,
    set_rotation: `[entity, a] -> entity`,
    set_width: `[entity, w] -> entity`,
    set_height: `[entity, h] -> entity`,
    set_origin: `[entity, x, y] -> entity`,
    open_path: `[path] -> path`,
    close_path: `[path] -> path`,
    make: `[prop, ...args] -> element`,
    get_width: `[] -> number`,
    get_height: `[] -> number`,
    get_origin: `[entity] -> number`,
    get_opacity: `[entity] -> number`,
    get_dashes: `[entity] -> string`,
    get_position: `[entity] -> number`,
    get_rotation: `[entity] -> number`,
    get_scale: `[entity] -> number`,
    get_translation: `[entity] -> vector`,
    get_bounds: `[entity] -> bounds`,
  },
}
