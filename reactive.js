class Component {
  constructor(key='', props={}, children=[]) {
    this._key = key;
    this._props = props;
    this._state = {};
    this._children = children;
  }

// Updating

  /**
   * Invoked before rendering when new props or state are being received.
   * This method is not called for the initial render or when forceUpdate is used.
   * Use this as an opportunity to return false when you're certain that the
   * transition to the new props and state will not require a component update.
   *
   * If shouldComponentUpdate returns false, then render() will be completely
   * skipped until the next state change.
   * In addition, componentWillUpdate and componentDidUpdate will not be called.
   *
   * By default, shouldComponentUpdate always returns true to prevent subtle bugs
   * when state is mutated in place, but if you are careful to always treat state
   * as immutable and to read only from props and state in render() then you can
   * override shouldComponentUpdate with an implementation that compares the old
   * props and state to their replacements.
   *
   * If performance is a bottleneck, especially with dozens or hundreds of components,
   * use shouldComponentUpdate to speed up your app.
   *
   * @param[in] nextProps
   * @param[in] nextState
   * @returns bool
   * @see https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate
   */
  shouldComponentUpdate(nextProps, nextState) { return true; }

  /**
   * Invoked immediately before rendering when new props or state are being received.
   * This method is not called for the initial render.
   * Use this as an opportunity to perform preparation before an update occurs.
   *
   * @param[in] nextProps
   * @param[in] nextState
   * @see https://facebook.github.io/react/docs/component-specs.html#updating-componentwillupdate
   */
  componentWillUpdate(nextProps, nextState) {}

  /**
   * Invoked immediately after the component's updates are flushed to the DOM.
   * This method is not called for the initial render.
   * Use this as an opportunity to operate on the DOM when the component has been updated.
   *
   * @param[in] prevProps
   * @param[in] prevState
   * @see https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
   */
  componentDidUpdate(prevProps, prevState) {}

  forceUpdate() { this.render(true); }

// State

  /**
   * Performs a shallow merge of nextState into current state.
   * This is the primary method you use to trigger UI updates from event handlers
   * and server request callbacks.
   *
   * @param[in] nextState
   * @param[in] cb(prevState, currentProps)
   * @see https://facebook.github.io/react/docs/component-api.html#setstate
   */
  setState(nextState, cb) {
    const PREV_STATE = this._state;

    // Shallow merge
    const NEW_STATE = Object.assign(Object.assign({}, PREV_STATE), nextState);

    if (this.shouldComponentUpdate(this._props, NEW_STATE)) {
      this.componentWillUpdate(this._props, NEW_STATE);
      this.render(true);
      this.componentDidUpdate(this._props, PREV_STATE);
    }
    this._state = NEW_STATE;
    if (cb) cb(PREV_STATE, this._props);
  }

  /**
   * @param {Component} component
   */
  addChild(component) {
    if (!component) return;

    // Don't allow duplicates.
    const IDX = this._children.findIndex((el) => (el && el.key === component.key));
    if (IDX === -1) {
      this._children.push(component);
      component.parent = this;
    } else {
      // Replace whatever's there if there
      this._children[IDX] = component;
    }
  }

  /**
   * @param {Component[]} components
   */
  addChildren(components) {
    for (const CHILD of components) { this.addChild(CHILD); }
  }

  /**
   * @param  {(Component|String)} component
   */
  removeChild(component) {
    if (!component) return;
    if (typeof component === 'string') {
      const IDX = this._children.findIndex((el) => (el && el.key === component.key));
      if (IDX !== -1) this._children.splice(IDX, 1);
    } else {
      this.removeChild(component.key);
    }
  }

  removeChildren() { this._children = []; }

// Getters and Setters

  get props() { return this._props; }
  get key() { return this._key; }
  get state() { return this._state; }
  set state(nextState) { this.setState(nextState); }
  get children() { return this._children; }
  get parent() { return this._parent; }
  set parent(parent) { this._parent = parent; }
}

export default { Component };
