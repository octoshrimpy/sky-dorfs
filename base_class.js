export default class BaseClass {
  static global_objs = []

  constructor(ctx, opts, sprite_path) {
    this.ctx = ctx
    this.opts = opts || {}

    this.setSprite(sprite_path)
    this.constructor.global_objs.push(this)
  }

  setSprite(sprite_str) {
    sprite_str = sprite_str || "placeholder"
    this.sprite_path = sprite_str
    var old_sprite = this.sprite
    var sprite_opts = this.opts
    if (old_sprite) {
      sprite_opts.x = old_sprite.x
      sprite_opts.y = old_sprite.y
      old_sprite.destroy(true)
    }
    let new_sprite = this.ctx.addSpriteWithAnim(sprite_str, sprite_opts)
    new_sprite.name = sprite_str
    this.sprite_anims = Object.keys(new_sprite.anims.animationManager.anims.entries)
    var self = this
    new_sprite.setInteractive().on("pointerdown", function() { self.clicked() })
    new_sprite.depth = new_sprite.y
    this.sprite = new_sprite

    return new_sprite
  }

  clicked() {
    if (this.ctx.selected) { this.ctx.selected.selected = false } // Unselect the previous selected

    this.ctx.selected = this
    this.selected = true
    console.log(this)
  }

  inspect() {
    return this.constructor.name
  }

  clearSprite() {
    this.sprite?.destroy(true)
    this.sprite = undefined
  }

  spriteHasAnim(anim) {
    return this.sprite_anims.includes([this.sprite_path, anim].join("."))
  }

  loopAnim(anim) {
    let continue_anim_if_already_playing = true
    this.sprite.anims.play([this.sprite_path, anim].join("."), continue_anim_if_already_playing)
  }

  stopAnim() {
    this.sprite.anims.stop(null)
  }

  tick() {
    // No op - should be overridden in child methods
  }

  // Class method
  static tick() {
    this.global_objs.forEach(function(obj) {
      obj.tick()
    })
  }

  static all() {
    return this.objs
  }
}
