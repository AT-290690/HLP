import { evaluate } from '../core/interpreter.js';
import { VOID } from '../core/tokeniser.js';
import Inventory from './Inventory.js';
const TimeExtension = {
    time_: {
        set_timeout: (args, env) => setTimeout(evaluate(args[0], env), evaluate(args[1], env)),
        set_interval: (args, env) => setInterval(evaluate(args[0], env), evaluate(args[1], env)),
        set_animation: (args, env) => requestAnimationFrame(evaluate(args[0], env)),
    },
};
const UnitsExtension = {
    units_: {
        pixels: (args, env) => `${evaluate(args[0], env)}px`,
        percent: (args, env) => `${evaluate(args[0], env)}percent`,
        viewport_height: (args, env) => `${evaluate(args[0], env)}vh`,
        viewport_width: (args, env) => `${evaluate(args[0], env)}vw`,
        centimeters: (args, env) => `${evaluate(args[0], env)}cm`,
        millimeters: (args, env) => `${evaluate(args[0], env)}mm`,
        inches: (args, env) => `${evaluate(args[0], env)}in`,
        points: (args, env) => `${evaluate(args[0], env)}pt`,
        picas: (args, env) => `${evaluate(args[0], env)}pc`,
    },
};
const DomExtension = {
    dom_: {
        div: () => {
            return document.createElement('div');
        },
        act: () => document.activeElement,
        set_attributes: (args, env) => {
            if (args.length < 2)
                throw new RangeError('Invalid number of arguments to dom_set_attributes [at least 2 required]');
            return evaluate(args[0], env);
        },
        set_attribute: (args, env) => {
            if (args.length !== 3)
                throw new RangeError('Invalid number of arguments to dom_set_attribute [3 required]');
            return evaluate(args[0], env);
        },
        get_attribute: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to dom_get_attribute [2 required]');
            return evaluate(args[0], env).getAttribute(evaluate(args[1], env));
        },
        ns_element: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to dom_create_element [2 required]');
            const ns = evaluate(args[0], env);
            if (typeof ns !== 'string')
                throw new TypeError('First argument of dom_create_element must be a string');
            const type = evaluate(args[1], env);
            if (typeof type !== 'string')
                throw new TypeError('Second argument of dom_create_element must be a string');
            return Inventory._dom_create_element_ns(ns, type);
        },
        create_element: (args, env) => {
            if (args.length !== 1)
                throw new RangeError('Invalid number of arguments to dom_create_element [1 required]');
            const type = evaluate(args[0], env);
            if (typeof type !== 'string')
                throw new TypeError('First argument of dom_create_element must be a string');
            return Inventory._dom_create_element(type);
        },
        remove: (args, env) => {
            args.slice(1).forEach((x) => evaluate(x, env));
            return evaluate(args[0], env);
        },
        detach: (args, env) => {
            evaluate(args[1], env);
            return evaluate(args[0], env);
        },
        insert: (args, env) => {
            args.slice(1).forEach((x) => evaluate(x, env));
            return evaluate(args[0], env);
        },
        append_to: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to dom_append_to [2 required]');
            evaluate(args[1], env);
            return evaluate(args[0], env);
        },
        get_body: () => {
            return document.createElement('body');
        },
        set_value: (args, env) => {
            evaluate(args[1], env);
            return evaluate(args[0], env);
        },
        get_value: (args, env) => {
            return evaluate(args[0], env).value;
        },
        get_element_by_id: (args, env) => {
            evaluate(args[0], env);
            return document.createElement('div');
        },
        set_text_content: (args, env) => {
            const element = evaluate(args[0], env);
            element.textContent = evaluate(args[1], env);
            return element;
        },
        set_style: (args, env) => {
            const el = evaluate(args[0], env);
            const styles = evaluate(args[1], env);
            styles.forEach((value, key) => {
                el.style[`${Inventory._dom_style_map.get(key) ?? key}`] = `${Inventory._dom_style_map.get(value) ?? value}`;
            });
            return el;
        },
        get_root: () => {
            return document.createElement('div');
        },
        key_down: () => {
            return {};
        },
        key_up: () => {
            return {};
        },
        css_link: () => {
            return {};
        },
        load_bulma: () => {
            return {};
        },
        load_milligram: () => {
            return {};
        },
        on_change: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to dom_on_change [2 required]');
            evaluate(args[1], env);
            return evaluate(args[0], env);
        },
        add_class: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to dom_add_class [2 required]');
            return evaluate(args[0], env);
        },
        clear: (args, env) => {
            if (args.length !== 1)
                throw new RangeError('Invalid number of arguments to dom_add_class (1 required)');
            return evaluate(args[0], env);
        },
        click: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to dom_click [2 required]');
            evaluate(args[1], env);
            return evaluate(args[0], env);
        },
        mouse_down: (args, env) => {
            return evaluate(args[0], env);
        },
        mouse_up: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to dom_mouse_up [2 required]');
            evaluate(args[1], env);
            return evaluate(args[0], env);
        },
        canvas: () => {
            const canvas = document.createElement('canvas');
            return canvas;
        },
    },
};
const CanvasExtension = {
    canvas_: {
        get_context: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to canvas_get_context [2 required]');
            return evaluate(args[0], env).getContext(evaluate(args[1], env));
        },
        fill_style: (args, env) => {
            return evaluate(args[0], env);
        },
        stroke_style: (args, env) => {
            return evaluate(args[0], env);
        },
        stroke: (args, env) => {
            return evaluate(args[0], env);
        },
        fill_rect: (args, env) => {
            return evaluate(args[0], env);
        },
        clear_rect: (args, env) => {
            return evaluate(args[0], env);
        },
        begin_path: (args, env) => {
            return evaluate(args[0], env);
        },
        close_path: (args, env) => {
            return evaluate(args[0], env);
        },
        move_to: (args, env) => {
            return evaluate(args[0], env);
        },
        line_to: (args, env) => {
            return evaluate(args[0], env);
        },
        line_width: (args, env) => {
            return evaluate(args[0], env);
        },
        bezier_curve_to: (args, env) => {
            return evaluate(args[0], env);
        },
        quadratic_curve_to: (args, env) => {
            return evaluate(args[0], env);
        },
        rect: (args, env) => {
            return evaluate(args[0], env);
        },
        round_rect: (args, env) => {
            return evaluate(args[0], env);
        },
        reset: (args, env) => {
            return evaluate(args[0], env);
        },
        reset_trasform: (args, env) => {
            return evaluate(args[0], env);
        },
        rotate: (args, env) => {
            return evaluate(args[0], env);
        },
        scale: (args, env) => {
            return evaluate(args[0], env);
        },
        transform: (args, env) => {
            return evaluate(args[0], env);
        },
        translate: (args, env) => {
            return evaluate(args[0], env);
        },
        save: (args, env) => {
            return evaluate(args[0], env);
        },
        restore: (args, env) => {
            return evaluate(args[0], env);
        },
        arc: (args, env) => {
            return evaluate(args[0], env);
        },
        arc_to: (args, env) => {
            return evaluate(args[0], env);
        },
        clip: (args, env) => {
            return evaluate(args[0], env);
        },
        ellipse: (args, env) => {
            return evaluate(args[0], env);
        },
        fill: (args, env) => {
            return evaluate(args[0], env);
        },
        get_image_data: (args, env) => {
            return evaluate(args[0], env);
        },
        draw_image: (args, env) => {
            return evaluate(args[0], env);
        },
        get_transform: (args, env) => {
            return evaluate(args[0], env);
        },
        set_transform: (args, env) => {
            return evaluate(args[0], env);
        },
        reset_transform: (args, env) => {
            return evaluate(args[0], env);
        },
        is_point_in_path: (args, env) => {
            return evaluate(args[0], env);
        },
        is_point_in_stroke: (args, env) => {
            return evaluate(args[0], env);
        },
    },
};
const StringExtension = {
    text_: {
        trim: (args, env) => evaluate(args[0], env).trim(),
        trim_start: (args, env) => evaluate(args[0], env).trimStart(),
        trim_end: (args, env) => evaluate(args[0], env).trimEnd(),
        to_upper_case: (args, env) => evaluate(args[0], env).toUpperCase(),
        to_lower_case: (args, env) => evaluate(args[0], env).toLowerCase(),
        make_regexp: (args, env) => new RegExp(evaluate(args[0], env)),
        match: (args, env) => {
            return evaluate(args[0], env).match(evaluate(args[1], env));
        },
        replace: (args, env) => evaluate(args[0], env).replace(evaluate(args[1], env)),
    },
};
const MathExtension = {
    math_: {
        factorial: (args, env) => {
            if (args.length !== 1)
                throw new RangeError('Invalid number of arguments to math_factorial');
            return Inventory._math_factorial(evaluate(args[0], env));
        },
        permutations: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to math_permutations');
            return Inventory._math_factorial(evaluate(args[0], env), evaluate(args[1], env));
        },
        permutations_array: (args, env) => {
            if (args.length !== 1)
                throw new RangeError('Invalid number of arguments to math_permutations_array');
            return Inventory._math_permutations_array(evaluate(args[0], env));
        },
        lerp: (args, env) => {
            if (args.length !== 3)
                throw new RangeError('Invalid number of arguments to math_lerp');
            const start = evaluate(args[0], env);
            const end = evaluate(args[1], env);
            const amt = evaluate(args[2], env);
            return (1 - amt) * start + amt * end;
        },
        abs: (args, env) => {
            if (args.length !== 1)
                throw new RangeError('Invalid number of arguments to math_abs');
            return Math.abs(evaluate(args[0], env));
        },
        mod: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to math_mod');
            const left = evaluate(args[0], env);
            const right = evaluate(args[1], env);
            return ((left % right) + right) % right;
        },
        clamp: (args, env) => {
            if (args.length !== 3)
                throw new RangeError('Invalid number of arguments to math_clamp [3 required]');
            const num = evaluate(args[0], env);
            const min = evaluate(args[1], env);
            const max = evaluate(args[2], env);
            return Math.min(Math.max(num, min), max);
        },
        sqrt: (args, env) => Math.sqrt(evaluate(args[0], env)),
        add: (args, env) => evaluate(args[0], env) + evaluate(args[1], env),
        sub: (args, env) => evaluate(args[0], env) - evaluate(args[1], env),
        mult: (args, env) => evaluate(args[0], env) * evaluate(args[1], env),
        pow: (args, env) => evaluate(args[0], env) ** evaluate(args[1], env),
        pow2: (args, env) => evaluate(args[0], env) ** 2,
        divide: (args, env) => evaluate(args[0], env) / evaluate(args[1], env),
        sign: (args, env) => Math.sign(evaluate(args[0], env)),
        trunc: (args, env) => Math.trunc(evaluate(args[0], env)),
        exp: (args, env) => Math.exp(evaluate(args[0], env)),
        floor: (args, env) => Math.floor(evaluate(args[0], env)),
        round: (args, env) => Math.round(evaluate(args[0], env)),
        random: () => Math.random(),
        random_int: (args, env) => {
            const max = evaluate(args[0], env);
            const min = evaluate(args[1], env);
            if (!Number.isInteger(max) || !Number.isInteger(min))
                throw new TypeError('math_random_int arguments must both be integeres');
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        max: (args, env) => Math.max(...args.map((x) => evaluate(x, env))),
        min: (args, env) => Math.min(...args.map((x) => evaluate(x, env))),
        sin: (args, env) => Math.sin(evaluate(args[0], env)),
        cos: (args, env) => Math.cos(evaluate(args[0], env)),
        tan: (args, env) => Math.tan(evaluate(args[0], env)),
        tanh: (args, env) => Math.tanh(evaluate(args[0], env)),
        atan: (args, env) => Math.atan(evaluate(args[0], env)),
        atan2: (args, env) => Math.atan2(evaluate(args[0], env), evaluate(args[1], env)),
        acos: (args, env) => {
            const N = evaluate(args[0], env);
            const n = Math.acos(N);
            return isNaN(n) ? VOID : n;
        },
        acosh: (args, env) => {
            const N = evaluate(args[0], env);
            const n = Math.acosh(N);
            return isNaN(n) ? VOID : n;
        },
        asin: (args, env) => {
            const N = evaluate(args[0], env);
            const n = Math.asin(N);
            return isNaN(n) ? VOID : n;
        },
        asinh: (args, env) => Math.asinh(evaluate(args[0], env)),
        atanh: (args, env) => {
            const N = evaluate(args[0], env);
            const n = Math.atanh(N);
            return isNaN(n) ? VOID : n;
        },
        hypot: (args, env) => Math.hypot(evaluate(args[0], env), evaluate(args[1], env)),
        fround: (args, env) => Math.fround(evaluate(args[0], env)),
        log10: (args, env) => Math.log10(evaluate(args[0], env)),
        log2: (args, env) => Math.log2(evaluate(args[0], env)),
        log: (args, env) => Math.log(evaluate(args[0], env)),
        sum: (args, env) => evaluate(args[0], env).reduce((acc, item) => (acc += item), 0),
        negative: (args, env) => -evaluate(args[0], env),
        parse_int: (args, env) => parseInt(evaluate(args[0], env).toString(), evaluate(args[1], env)),
        number: (args, env) => Number(evaluate(args[0], env)),
        MIN_INT: Number.MIN_SAFE_INTEGER,
        MAX_INT: Number.MAX_SAFE_INTEGER,
        INFINITY: Number.POSITIVE_INFINITY,
        PI: Math.PI,
        E: Math.E,
        LN10: Math.LN10,
        LOG10E: Math.LOG10E,
        SQRT1_2: Math.SQRT1_2,
        SQRT2: Math.SQRT2,
    },
};
const BitExtension = {
    bit_: {
        make_bit: (args, env) => {
            if (args.length !== 1)
                throw new RangeError('Invalid number of arguments to bit_make_bit [1 required]');
            return (evaluate(args[0], env) >>> 0).toString(2);
        },
        and: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to bit_and [2 required]');
            return evaluate(args[0], env) & evaluate(args[1], env);
        },
        not: (args, env) => {
            if (args.length !== 1)
                throw new RangeError('Invalid number of arguments to bit_not [1 required]');
            return ~evaluate(args[0], env);
        },
        or: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to bit_or [2 required]');
            return evaluate(args[0], env) | evaluate(args[1], env);
        },
        xor: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to bit_xor [2 required]');
            return evaluate(args[0], env) ^ evaluate(args[1], env);
        },
        left_shift: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to bit_left_shift [2 required]');
            return evaluate(args[0], env) << evaluate(args[1], env);
        },
        right_shift: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to bit_right_shift [2 required]');
            return evaluate(args[0], env) >> evaluate(args[1], env);
        },
        un_right_shift: (args, env) => {
            if (args.length !== 2)
                throw new RangeError('Invalid number of arguments to bit_un_right_shift [2 required]');
            return evaluate(args[0], env) >>> evaluate(args[1], env);
        },
    },
};
const Console = {
    console_: {
        log: (args, env) => {
            const out = evaluate(args[0], env);
            console.log(out);
            return out;
        },
    },
};
const Extensions = {
    ...Console,
    ...BitExtension,
    ...MathExtension,
    ...StringExtension,
    ...TimeExtension,
    ...DomExtension,
    ...UnitsExtension,
    ...CanvasExtension,
};
const extensions = {};
for (const ext in Extensions)
    for (const sub in Extensions[ext])
        extensions[`${ext}${sub}`] = Extensions[ext][sub];
export { extensions };
