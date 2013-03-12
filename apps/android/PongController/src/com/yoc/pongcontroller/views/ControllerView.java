package com.yoc.pongcontroller.views;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.RectShape;
import android.util.AttributeSet;
import android.view.View;

import com.yoc.pongcontroller.OnMotionListener;

public class ControllerView extends View implements OnMotionListener {

	private int mControllerX, mControllerY, mControllerWidth,
			mControllerHeight;
	private int mCanvasWidth, mCanvasHeight;
	
	private ShapeDrawable mController;

	public int getPositionToSend() {

		return (int) (Integer.MIN_VALUE + ((float) mControllerY / ((float) mCanvasHeight - (float) mControllerHeight))
				* 2 * Integer.MAX_VALUE)
				- Integer.MAX_VALUE;
	}

	public ControllerView(Context context, AttributeSet attrs){
		super(context, attrs);
		init();
	}

	public ControllerView(Context context) {
		super(context);
		init();
	}

	private void init() {
		mControllerWidth = 50;
		mControllerHeight = 300;

		mController = new ShapeDrawable(new RectShape());
		mController.getPaint().setColor(Color.WHITE);
		updateControllerPosition();
	}

	protected void onDraw(final Canvas canvas) {
		mCanvasWidth = canvas.getWidth();
		mCanvasHeight = canvas.getHeight();
		super.onDraw(canvas);
		mController.draw(canvas);
	}

	public void setControllerBounds(final int x, final int y, final int width,
			final int height) {
		mControllerX = x;
		mControllerY = y;
		mControllerWidth = width;
		mControllerHeight = height;
		updateControllerPosition();
	}

	private void updateControllerPosition() {
		mController.setBounds(mControllerX, mControllerY, mControllerX
				+ mControllerWidth, mControllerY + mControllerHeight);
	}

	@Override
	public void onMotion(int xDistance, int yDistance) {
		mControllerX += xDistance;
		mControllerY += yDistance;
		if (mControllerY + mControllerHeight > mCanvasHeight) {
			mControllerY = mCanvasHeight - mControllerHeight;
		}
		if (mControllerX + mControllerWidth > mCanvasWidth) {
			mControllerY = mCanvasWidth - mControllerWidth;
		}
		if (mControllerX < 0) {
			mControllerX = 0;
		}
		if (mControllerY < 0) {
			mControllerY = 0;
		}
		updateControllerPosition();
		this.invalidate();
	}

}