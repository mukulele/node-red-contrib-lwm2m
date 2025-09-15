{
  'variables': {
    'module_name%': 'node_lwm2m',
    'module_path%': 'build',
    'deps_dir': './deps',
    'src_dir': './src',
  },
  'targets': [
    {
      'target_name': '<(module_name)',
      'include_dirs': [
        '<(src_dir)',
        'node_modules/node-addon-api',
      ],
      'dependencies': [
        '<(deps_dir)/wakatiwai/wakatiwai.gyp:wakatiwaiclient',
      ],
      'cflags': [
      ],
      'sources': [
        '<(src_dir)/node_lwm2m.cc',
      ],
      'napi_build_version': 8,
      'cflags_cc': [
      ],
      'defines': [
        'NODE_ADDON_API_DISABLE_CPP_EXCEPTIONS',
      ],
    },
    {
      'target_name': 'action_after_build',
      'type': 'none',
      'dependencies': [
        '<(module_name)',
      ],
      'copies': [
        {
          'files': [
            '<(PRODUCT_DIR)/<(module_name).node',
            '<(PRODUCT_DIR)/wakatiwaiclient'
          ],
          'destination': '<(module_path)'
        }
      ]
    }
  ]
}
