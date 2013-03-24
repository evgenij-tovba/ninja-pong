package com.yoc.pongcontroller;

import android.app.Activity;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;

import com.yoc.pongcontroller.views.ControllerView;

public class ControllerActivity extends Activity {
	private static final String LOG_TAG = "PongController";

	private static final int CONTROLLER_WIDTH_DIP = 25;
	private static final int CONTROLLER_HEIGHT_DIP = 150;

	private UDPPacketSender mSender;
	private ControllerView mControllerView;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_controller);

		connectTo(getIntent().getStringExtra(MainActivity.EXTRAS_IP),
				getIntent().getStringExtra(MainActivity.EXTRAS_PORT));

		mControllerView = (ControllerView) findViewById(R.id.controller_view);

		final DisplayMetrics metrics = new DisplayMetrics();
		getWindowManager().getDefaultDisplay().getMetrics(metrics);

		final float controllerWidth = metrics.density * CONTROLLER_WIDTH_DIP;
		final float controllerHeight = metrics.density * CONTROLLER_HEIGHT_DIP;
		mControllerView.setControllerBounds(
				(int) (metrics.widthPixels / 2 - controllerWidth / 2), 0,
				(int) controllerWidth,
				(int) controllerHeight);

		mControllerView.setOnTouchListener(new OnTouchListener() {

			private int lastRawX = -1, lastRawY = -1;
			@Override
			public boolean onTouch(View arg0, MotionEvent arg1) {
				if (lastRawX != -1) {
					mControllerView.onMotion(0, (int) arg1.getRawY() - lastRawY);

					mSender.setPosition(mControllerView.getPositionToSend());
				}
				lastRawX = (int) arg1.getRawX();
				lastRawY = (int) arg1.getRawY();
				
				if((arg1.getActionMasked() & MotionEvent.ACTION_UP) == MotionEvent.ACTION_UP){
					lastRawX = lastRawY = -1;
				}
				return true;
			}
		});

	}

	private void connectTo(final String ip, final String port) {
		mSender = new UDPPacketSender(ip, Integer.valueOf(port));
		mSender.initializeSocketThread();
	}

}
